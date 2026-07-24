/**
 * useEditLayout — 大屏编辑模式布局状态管理
 *
 * 维护左右两侧栏的 TechCard 列表，提供增 / 删 / 改 / 移动操作，
 * 并自动持久化到 localStorage（key: fzm-edit-layout）。
 */
import { ref, watch } from 'vue'

/** 卡片内部内容类型（图表 / 数值·KPI / 列表·行 三大类） */
export type ContentType =
  | 'line' // 折线图
  | 'bar' // 柱状图
  | 'pie' // 饼图
  | 'kpi' // KPI 大数字
  | 'countup' // 数字滚动
  | 'metric' // Mini 统计方块
  | 'data-row' // 数据键值行
  | 'tech-row' // 科技列表项
  | 'progress' // 进度条

/** 内容类型元信息（供 TechSelect / 添加面板渲染） */
export interface ContentTypeMeta {
  type: ContentType
  label: string
  category: '图表' | '数值 / KPI' | '列表 / 行'
}

/** 全部可选内容类型 */
export const CONTENT_TYPES: ContentTypeMeta[] = [
  { type: 'line', label: '折线图', category: '图表' },
  { type: 'bar', label: '柱状图', category: '图表' },
  { type: 'pie', label: '饼图', category: '图表' },
  { type: 'kpi', label: 'KPI 大数字', category: '数值 / KPI' },
  { type: 'countup', label: '数字滚动', category: '数值 / KPI' },
  { type: 'metric', label: 'Mini 统计方块', category: '数值 / KPI' },
  { type: 'data-row', label: '数据键值行', category: '列表 / 行' },
  { type: 'tech-row', label: '科技列表项', category: '列表 / 行' },
  { type: 'progress', label: '进度条', category: '列表 / 行' },
]

/** 根据 ContentType 查元信息（找不到回退折线图）。仅内部使用 */
function getContentTypeMeta(type: ContentType): ContentTypeMeta {
  return CONTENT_TYPES.find((c) => c.type === type) ?? CONTENT_TYPES[0]
}

/** 一张可编辑卡片 */
export interface EditableCard {
  id: string
  title: string
  contentType: ContentType
  /**
   * 卡片宽度（CSS 长度字符串，如 '320px' / '100%'）。
   * 空字符串 = 不设置，跟随侧栏宽度。
   */
  width?: string
  /**
   * 卡片高度（CSS 长度字符串，如 '200px'）。
   * 自由画布模式下卡片必须有显式高度，否则 absolute 定位会塌陷。
   */
  height?: string
  /**
   * 自由位置（px，相对 .edit-mode 画布左上角）。
   * 逻辑必填：新增卡片自动算初始位置（画布中部错开）；
   * 旧数据无 x/y 时由 loadLayout 补默认值。左键拖动后实时更新。
   */
  x?: number
  y?: number
}

/** 编辑布局（左右两侧） */
export interface EditLayout {
  left: EditableCard[]
  right: EditableCard[]
}

/** 侧：左 / 右 */
export type Side = keyof EditLayout

/**
 * TechSelect 的 options 项（@fzm-tech-hud/ui 未导出类型，按其内部结构定义）。
 * 集中定义于此，供 EditModeView / CardSettingsPanel / EditableCard 复用。
 */
export interface SelectOption {
  label: string
  value: string | number
  [key: string]: unknown
}

const STORAGE_KEY = 'fzm-edit-layout'

/** 生成稳定唯一 id（优先用 crypto.randomUUID，旧环境回退） */
function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/** 默认卡片尺寸（自由画布模式必须显式） */
const DEFAULT_W = 320
const DEFAULT_H = 200

/**
 * 计算新增卡片在画布上的初始位置：画布中部 + 按已有数量错开，避免完全重叠。
 * 画布尺寸取视口（无 window 时给保守默认），每张偏移 30px。
 */
function calcInitialPosition(existingCount: number): { x: number; y: number } {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900
  const offset = existingCount * 30
  return {
    x: Math.round((vw - DEFAULT_W) / 2 + offset),
    y: Math.round((vh - DEFAULT_H) / 2 + offset),
  }
}

/** 默认布局（参考现有 DashboardView 的拼装思路，自由画布定位） */
function defaultLayout(): EditLayout {
  const cards = [
    { title: '实时产线趋势', contentType: 'line' as ContentType },
    { title: '设备状态分布', contentType: 'pie' as ContentType },
    { title: '告警列表', contentType: 'tech-row' as ContentType },
    { title: '核心指标', contentType: 'metric' as ContentType },
    { title: '产能统计', contentType: 'bar' as ContentType },
  ]
  // 全部归到 left（渲染层展平，side 不影响位置）
  const left = cards.map((c, i) => {
    const pos = calcInitialPosition(i)
    return {
      id: uid(),
      title: c.title,
      contentType: c.contentType,
      width: `${DEFAULT_W}px`,
      height: `${DEFAULT_H}px`,
      x: pos.x,
      y: pos.y,
    }
  })
  return { left, right: [] }
}

/** 读取持久化布局（解析失败 / 缺字段 → 回退默认） */
function loadLayout(): EditLayout {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultLayout()
    const parsed = JSON.parse(raw) as Partial<EditLayout>
    if (!parsed || !Array.isArray(parsed.left) || !Array.isArray(parsed.right)) {
      return defaultLayout()
    }
    // 过滤掉字段不全的脏数据；无 x/y 的旧数据补默认位置（向后兼容）
    let counter = 0
    const clean = (arr: unknown[]): EditableCard[] =>
      arr
        .filter(
          (c): c is Record<string, unknown> =>
            !!c && typeof c === 'object' && 'id' in c && 'title' in c && 'contentType' in c,
        )
        .map((c) => {
          const card = c as unknown as EditableCard
          if (card.x === undefined || card.y === undefined) {
            const pos = calcInitialPosition(counter)
            card.x = pos.x
            card.y = pos.y
            if (!card.width) card.width = `${DEFAULT_W}px`
            if (!card.height) card.height = `${DEFAULT_H}px`
          }
          counter++
          return card
        })
    return { left: clean(parsed.left), right: clean(parsed.right) }
  } catch {
    return defaultLayout()
  }
}

/**
 * 编辑布局 composable（模块级单例 —— 整个应用共享同一份布局状态）
 */
const layout = ref<EditLayout>(loadLayout())

// 深度监听，自动持久化（saveLayout 仅在浏览器环境）
if (typeof window !== 'undefined') {
  watch(
    layout,
    (val) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
      } catch {
        /* localStorage 满或被禁用 —— 静默降级为会话内有效 */
      }
    },
    { deep: true },
  )
}

/** 末尾追加一张卡片（初始位置 = 画布中部 + 已有数量错开） */
function addCard(side: Side, contentType: ContentType, title?: string) {
  const meta = getContentTypeMeta(contentType)
  const existing = layout.value.left.length + layout.value.right.length
  const pos = calcInitialPosition(existing)
  layout.value[side].push({
    id: uid(),
    title: title?.trim() || meta.label,
    contentType,
    width: `${DEFAULT_W}px`,
    height: `${DEFAULT_H}px`,
    x: pos.x,
    y: pos.y,
  })
}

/** 删除指定卡片 */
function removeCard(side: Side, id: string) {
  layout.value[side] = layout.value[side].filter((c) => c.id !== id)
}

/** 上下移动（dir: -1 上移 / +1 下移，边界自动 clamp） */
function moveCard(side: Side, id: string, dir: -1 | 1) {
  const list = layout.value[side]
  const i = list.findIndex((c) => c.id === id)
  if (i < 0) return
  const j = i + dir
  if (j < 0 || j >= list.length) return
  ;[list[i], list[j]] = [list[j], list[i]]
}

/** 改标题 */
function updateTitle(side: Side, id: string, title: string) {
  const card = layout.value[side].find((c) => c.id === id)
  if (card) card.title = title
}

/** 改内容类型 */
function updateContentType(side: Side, id: string, contentType: ContentType) {
  const card = layout.value[side].find((c) => c.id === id)
  if (card) card.contentType = contentType
}

/**
 * 改宽高。width / height 传 undefined 表示该项保持不变；
 * 传空串表示清空（回到默认：宽度跟随侧栏，高度 = fill）。
 */
function updateSize(side: Side, id: string, width?: string, height?: string) {
  const card = layout.value[side].find((c) => c.id === id)
  if (!card) return
  if (width !== undefined) card.width = width.trim()
  if (height !== undefined) card.height = height.trim()
}

/** 清持久化并恢复默认布局 */
function resetLayout() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
  layout.value = defaultLayout()
}

/**
 * 更新卡片自由位置（左键拖动结束时调用）。
 * 写入 x/y 后卡片即转为自由定位；持久化由 watch deep 自动完成。
 */
function updatePosition(side: Side, id: string, x: number, y: number) {
  const card = layout.value[side].find((c) => c.id === id)
  if (card) {
    card.x = Math.round(x)
    card.y = Math.round(y)
  }
}

export function useEditLayout() {
  return {
    layout,
    addCard,
    removeCard,
    moveCard,
    updateTitle,
    updateContentType,
    updateSize,
    updatePosition,
    resetLayout,
  }
}
