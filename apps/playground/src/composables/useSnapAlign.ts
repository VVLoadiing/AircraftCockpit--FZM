/**
 * useSnapAlign — 拖动时与其他卡片的对齐吸附 + 参考线
 *
 * 原理：
 *  1. 每张卡片参与对齐的参考线有 6 条：x 轴（左/中/右）+ y 轴（上/中/下）
 *  2. 拖动中的卡片（target）的 6 条线，逐一与其他卡片（others）的 6 条线比距离
 *  3. 距离 ≤ threshold（默认 6px）时：把 target 吸附到参考位置，并记录一条参考线
 *  4. 多个命中取最近的；x/y 两轴独立检测，可同时吸附
 *  5. 参考线只画在「拖动卡片」与「被对齐卡片」的公共区间，视觉上连接两者
 *
 * 纯函数式，无 DOM 依赖，SSR 安全。由 EditableCard 在 useDraggable 的 onMove 里调用。
 */
import { ref } from 'vue'

/** 卡片几何（画布坐标系，px） */
export interface CardGeom {
  x: number
  y: number
  w: number
  h: number
}

/** 拉升方向（8 向）：n/s/e/w + 四角。用于 snapAlign 的 resizeDir 参数 */
export type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

/** 一条参考线：轴 / 坐标位置 / 起止范围（决定线段长度） */
export interface AlignLine {
  /** 'x' 竖线（左右对齐）；'y' 横线（上下对齐） */
  axis: 'x' | 'y'
  /** 线的位置：x 轴时是 left 值，y 轴时是 top 值 */
  pos: number
  /** 线段起止（另一轴的 min..max，覆盖两张卡片的公共区间） */
  from: number
  to: number
}

/** 默认吸附阈值 */
const DEFAULT_THRESHOLD = 6

/** 从一张卡片算出 6 条参考线的坐标（左/中/右 + 上/中/下） */
function getEdges(g: CardGeom) {
  return {
    // x 轴三条：左边、中线、右边
    x: [g.x, g.x + g.w / 2, g.x + g.w],
    // y 轴三条：上边、中线、下边
    y: [g.y, g.y + g.h / 2, g.y + g.h],
  }
}

/**
 * 组合式函数：提供对齐吸附检测 + 参考线状态。
 * alignLines 是响应式的，由 EditModeView 顶层读取渲染。
 */
export function useSnapAlign() {
  /** 当前激活的参考线（拖动中实时更新，结束时清空） */
  const alignLines = ref<AlignLine[]>([])

  /**
   * 检测并吸附。
   * @param target  当前卡片几何（拖动时 x/y 为实时位置；拉升时含实时 w/h）
   * @param others  其他卡片的几何数组
   * @param threshold 吸附阈值，默认 6px
   * @param resizeDir 拉升方向；传了走"拉升分支"（改尺寸，对侧不动），不传走"拖动分支"（改位置）
   * @returns 吸附后的几何（未命中则原样返回）
   */
  function snapAlign(
    target: CardGeom,
    others: CardGeom[],
    threshold = DEFAULT_THRESHOLD,
    resizeDir?: ResizeDir,
  ): CardGeom {
    const lines: AlignLine[] = []
    const tEdges = getEdges(target)

    // 拖动分支：整体平移，吸附改 x/y（原逻辑，向后兼容）
    if (!resizeDir) {
      let snappedX = target.x
      let snappedY = target.y

      // X 轴：target 的左/中/右 vs others 的左/中/右
      let bestXDist = threshold + 1
      let bestXPos = target.x
      let bestXLine: AlignLine | null = null
      for (const o of others) {
        const oEdges = getEdges(o)
        for (let ti = 0; ti < 3; ti++) {
          for (let oi = 0; oi < 3; oi++) {
            const dist = Math.abs(tEdges.x[ti] - oEdges.x[oi])
            if (dist <= threshold && dist < bestXDist) {
              bestXDist = dist
              const offset = ti === 0 ? 0 : ti === 1 ? target.w / 2 : target.w
              bestXPos = oEdges.x[oi] - offset
              bestXLine = {
                axis: 'x',
                pos: oEdges.x[oi],
                from: Math.min(target.y, o.y),
                to: Math.max(target.y + target.h, o.y + o.h),
              }
            }
          }
        }
      }
      if (bestXLine) {
        snappedX = bestXPos
        lines.push(bestXLine)
      }

      // Y 轴：target 的上/中/下 vs others 的上/中/下
      let bestYDist = threshold + 1
      let bestYPos = target.y
      let bestYLine: AlignLine | null = null
      for (const o of others) {
        const oEdges = getEdges(o)
        for (let ti = 0; ti < 3; ti++) {
          for (let oi = 0; oi < 3; oi++) {
            const dist = Math.abs(tEdges.y[ti] - oEdges.y[oi])
            if (dist <= threshold && dist < bestYDist) {
              bestYDist = dist
              const offset = ti === 0 ? 0 : ti === 1 ? target.h / 2 : target.h
              bestYPos = oEdges.y[oi] - offset
              bestYLine = {
                axis: 'y',
                pos: oEdges.y[oi],
                from: Math.min(target.x, o.x),
                to: Math.max(target.x + target.w, o.x + o.w),
              }
            }
          }
        }
      }
      if (bestYLine) {
        snappedY = bestYPos
        lines.push(bestYLine)
      }

      alignLines.value = lines
      return { x: snappedX, y: snappedY, w: target.w, h: target.h }
    }

    // —— 拉升分支：只检测"正在移动的那条边"，吸附改尺寸（对侧不动）——
    let snappedX = target.x
    let snappedY = target.y
    let snappedW = target.w
    let snappedH = target.h

    // X 轴：e 检测右边(改 w)，w 检测左边(改 x，右边不动)
    const xEdgeIdx = resizeDir.includes('e') ? 2 : resizeDir.includes('w') ? 0 : -1
    if (xEdgeIdx >= 0) {
      let bestDist = threshold + 1
      let bestVal = tEdges.x[xEdgeIdx]
      let bestLine: AlignLine | null = null
      for (const o of others) {
        const oEdges = getEdges(o)
        for (let oi = 0; oi < 3; oi++) {
          const dist = Math.abs(tEdges.x[xEdgeIdx] - oEdges.x[oi])
          if (dist <= threshold && dist < bestDist) {
            bestDist = dist
            bestVal = oEdges.x[oi]
            bestLine = {
              axis: 'x',
              pos: oEdges.x[oi],
              from: Math.min(target.y, o.y),
              to: Math.max(target.y + target.h, o.y + o.h),
            }
          }
        }
      }
      if (bestLine) {
        lines.push(bestLine)
        if (resizeDir.includes('e')) {
          // 右边吸附：改 w，x 不动（右边 = x + w = bestVal）
          snappedW = bestVal - target.x
        } else {
          // 左边吸附：改 x，右边不动（右边 = x + w 原值，故 newW = 右边 - newX）
          const rightEdge = target.x + target.w
          snappedX = bestVal
          snappedW = rightEdge - snappedX
        }
      }
    }

    // Y 轴：s 检测下边(改 h)，n 检测上边(改 y，下边不动)
    const yEdgeIdx = resizeDir.includes('s') ? 2 : resizeDir.includes('n') ? 0 : -1
    if (yEdgeIdx >= 0) {
      let bestDist = threshold + 1
      let bestVal = tEdges.y[yEdgeIdx]
      let bestLine: AlignLine | null = null
      for (const o of others) {
        const oEdges = getEdges(o)
        for (let oi = 0; oi < 3; oi++) {
          const dist = Math.abs(tEdges.y[yEdgeIdx] - oEdges.y[oi])
          if (dist <= threshold && dist < bestDist) {
            bestDist = dist
            bestVal = oEdges.y[oi]
            bestLine = {
              axis: 'y',
              pos: oEdges.y[oi],
              from: Math.min(target.x, o.x),
              to: Math.max(target.x + target.w, o.x + o.w),
            }
          }
        }
      }
      if (bestLine) {
        lines.push(bestLine)
        if (resizeDir.includes('s')) {
          snappedH = bestVal - target.y
        } else {
          const bottomEdge = target.y + target.h
          snappedY = bestVal
          snappedH = bottomEdge - snappedY
        }
      }
    }

    alignLines.value = lines
    return { x: snappedX, y: snappedY, w: snappedW, h: snappedH }
  }

  /** 清空参考线（拖动结束时调用） */
  function clearLines() {
    alignLines.value = []
  }

  return {
    /** 当前激活的参考线（响应式，驱动渲染） */
    alignLines,
    /** 检测并吸附，返回吸附后的几何 */
    snapAlign,
    /** 清空参考线 */
    clearLines,
  }
}
