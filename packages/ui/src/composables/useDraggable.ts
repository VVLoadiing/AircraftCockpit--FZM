/**
 * useDraggable — 元素拖动（改位置）
 *
 * 原理：
 *  1. 在目标元素上监听 mousedown(button===0 左键) 启动拖拽
 *  2. 拖拽期间的 mousemove/mouseup 绑定到 document，保证鼠标移出元素
 *     边界仍能继续跟手（最常见的坑：绑在元素上则移出即停）
 *  3. 位置只返回响应式 ref，由调用方自行绑定 transform / left —— 走 GPU、可持久化
 *  4. 支持 bounds（不拖出边界）、grid（网格吸附）、handle（限定手柄）、disabled（响应式禁用）
 *  5. onScopeDispose 中解绑全部 document 监听，防止组件卸载中途拖拽导致泄漏
 *
 * 仅监听左键（button === 0）；SSR 安全：无 document 时跳过 DOM 操作。
 */
import { onScopeDispose, ref, readonly, unref, watch } from 'vue'
import type { Ref } from 'vue'

/** 拖动位置（相对偏移量，单位 px） */
export interface DragPosition {
  x: number
  y: number
}

/** 边界约束目标 */
export type DragBounds = 'parent' | 'window' | Ref<HTMLElement | null>

/** useDraggable 选项 */
export interface UseDraggableOptions {
  /** 初始位置，默认 {0, 0} */
  initial?: DragPosition
  /** 边界约束：'parent' 不拖出父容器；'window' 不拖出视口；也可传任意元素 ref */
  bounds?: DragBounds
  /** 网格吸附，如 [8, 8] —— 最终位置对齐到网格倍数 */
  grid?: [number, number]
  /** 拖拽手柄：仅在该元素上按下左键才拖动（target 默认整个元素可拖） */
  handle?: Ref<HTMLElement | null>
  /** 响应式禁用：为 true 时忽略拖动 */
  disabled?: Ref<boolean>
  /** 拖动开始回调；返回 false 可阻止本次拖动 */
  onStart?: (pos: DragPosition) => boolean | void
  /** 拖动中回调（每次位置变化） */
  onMove?: (pos: DragPosition) => void
  /** 拖动结束回调 */
  onEnd?: (pos: DragPosition) => void
}

/** 把任意值规整到 grid 倍数（grid<=0 时原样返回） */
function snapToGrid(value: number, grid: number): number {
  if (!grid || grid <= 0) return value
  return Math.round(value / grid) * grid
}

/** 计算受边界约束后的位置；无 bounds 或无法计算时原样返回 */
function clampToBounds(
  el: HTMLElement,
  next: DragPosition,
  bounds: DragBounds | undefined,
): DragPosition {
  if (!bounds) return next
  let minX = -Infinity
  let maxX = Infinity
  let minY = -Infinity
  let maxY = Infinity

  // 'parent'：以父容器为边界（target 用 transform 位移，故 parent 相对视口即上限）
  // ref：以指定元素为边界
  let container: DOMRect | null = null
  if (bounds === 'parent') {
    container = el.parentElement?.getBoundingClientRect() ?? null
  } else if (bounds === 'window') {
    container = null // 走 innerWidth/Height 分支
  } else {
    // bounds 是 Ref<HTMLElement | null>
    const node = unref(bounds)
    container = node?.getBoundingClientRect() ?? null
  }

  if (bounds === 'window') {
    maxX = Math.max(0, window.innerWidth - el.offsetWidth)
    maxY = Math.max(0, window.innerHeight - el.offsetHeight)
  } else if (container) {
    // target 起始 rect（未应用 transform 前的位置），用于换算
    const base = el.getBoundingClientRect()
    // 当前 base.left 即 target 当前左上角视口坐标；
    // next.x 是相对初始位置的偏移，故越界判断基于 base + 偏移
    const elLeft = base.left
    const elTop = base.top
    minX = elLeft + (container.left - elLeft) // 左边贴边时偏移
    maxX = elLeft + (container.right - elLeft) - el.offsetWidth
    minY = elTop + (container.top - elTop)
    maxY = elTop + (container.bottom - elTop) - el.offsetHeight
    // 注意：由于 demo 中 target 初始即贴 parent 左上角，minX/minY 通常为 0
  }

  return {
    x: Math.min(Math.max(next.x, minX), maxX),
    y: Math.min(Math.max(next.y, minY), maxY),
  }
}

/**
 * 组合式函数：为元素绑定左键拖动，返回响应式位置。
 * @example
 * const el = templateRef<HTMLElement>('el')
 * const { position, isDragging } = useDraggable(el, { bounds: 'parent' })
 */
export function useDraggable(
  target: Ref<HTMLElement | null>,
  options: UseDraggableOptions = {},
) {
  const {
    initial = { x: 0, y: 0 },
    bounds,
    grid,
    handle,
    disabled,
    onStart,
    onMove,
    onEnd,
  } = options

  const position = ref<DragPosition>({ ...initial })
  const isDragging = ref(false)

  // 拖拽过程中记录的起始指针 / 起始位置，用于增量计算
  let startPointerX = 0
  let startPointerY = 0
  let startPosX = 0
  let startPosY = 0

  // 保存拖拽前 body 的 userSelect，结束时还原
  let prevUserSelect = ''

  /** 绑定到 document 的 mousemove 处理 */
  function onDocMouseMove(e: MouseEvent) {
    if (!isDragging.value) return
    const el = target.value
    if (!el) return

    const dx = e.clientX - startPointerX
    const dy = e.clientY - startPointerY
    let next: DragPosition = { x: startPosX + dx, y: startPosY + dy }

    // 网格吸附
    if (grid) {
      next = {
        x: snapToGrid(next.x, grid[0]),
        y: snapToGrid(next.y, grid[1]),
      }
    }

    // 边界约束
    next = clampToBounds(el, next, bounds)

    position.value = next
    onMove?.(next)
  }

  /** 结束拖拽：解绑临时监听、还原状态 */
  function endDrag() {
    if (!isDragging.value) return
    isDragging.value = false
    document.removeEventListener('mousemove', onDocMouseMove)
    document.removeEventListener('mouseup', endDrag)

    // 还原文本选中
    if (typeof document !== 'undefined') {
      document.body.style.userSelect = prevUserSelect
    }
    onEnd?.({ ...position.value })
  }

  /** 目标元素上的 mousedown：左键启动拖拽 */
  function onTargetMouseDown(e: MouseEvent) {
    // 仅左键触发
    if (e.button !== 0) return
    // 禁用时不响应
    if (disabled?.value) return

    // 若指定了手柄，必须从手柄上按下
    if (handle) {
      const handleEl = unref(handle)
      if (handleEl && !handleEl.contains(e.target as Node)) return
    }

    const el = target.value
    if (!el) return

    // 启动回调，返回 false 可中断
    if (onStart?.({ ...position.value }) === false) return

    e.preventDefault()
    isDragging.value = true
    startPointerX = e.clientX
    startPointerY = e.clientY
    startPosX = position.value.x
    startPosY = position.value.y

    // 拖拽期间禁止文本选中
    if (typeof document !== 'undefined') {
      prevUserSelect = document.body.style.userSelect
      document.body.style.userSelect = 'none'
    }

    document.addEventListener('mousemove', onDocMouseMove)
    document.addEventListener('mouseup', endDrag)
  }

  // —— 绑定 / 解绑（watch target 出现则挂载，卸载则移除）——
  function bind(el: HTMLElement) {
    el.addEventListener('mousedown', onTargetMouseDown)
  }

  function unbind(el: HTMLElement) {
    el.removeEventListener('mousedown', onTargetMouseDown)
    // 若卸载时仍在拖拽，清理 document 监听
    if (isDragging.value) endDrag()
  }

  // 用 watch 跟踪 target：templateRef 在 mounted 后才拿到 DOM，需等它出现再绑定。
  // flush:'post' 保证在 DOM 更新后执行，元素一定已挂载。
  const stopWatch = watch(
    target,
    (el, prev) => {
      if (prev) unbind(prev)
      if (el) bind(el)
    },
    { flush: 'post', immediate: true },
  )

  /** 重置到初始位置 */
  function reset() {
    position.value = { ...initial }
  }

  // 组件卸载 / scope 销毁时清理一切
  onScopeDispose(() => {
    stopWatch()
    const el = target.value
    if (el) unbind(el)
    if (isDragging.value) endDrag()
  })

  return {
    /** 当前位置（响应式） */
    position,
    /** 是否正在拖动（只读） */
    isDragging: readonly(isDragging),
    /** 重置到初始位置 */
    reset,
  }
}
