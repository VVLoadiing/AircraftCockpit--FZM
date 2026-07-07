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

/** 根据 ContentType 查元信息（找不到回退折线图） */
export function getContentTypeMeta(type: ContentType): ContentTypeMeta {
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
   * 空字符串 / 未设置 = fill 模式（在侧栏 flex 列里均分高度）。
   */
  height?: string
}

/** 编辑布局（左右两侧） */
export interface EditLayout {
  left: EditableCard[]
  right: EditableCard[]
}

/** 侧：左 / 右 */
export type Side = keyof EditLayout

const STORAGE_KEY = 'fzm-edit-layout'

/** 生成稳定唯一 id（优先用 crypto.randomUUID，旧环境回退） */
function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/** 默认布局（参考现有 DashboardView 的拼装思路） */
function defaultLayout(): EditLayout {
  return {
    left: [
      { id: uid(), title: '实时产线趋势', contentType: 'line' },
      { id: uid(), title: '设备状态分布', contentType: 'pie' },
    ],
    right: [
      { id: uid(), title: '告警列表', contentType: 'tech-row' },
      { id: uid(), title: '核心指标', contentType: 'metric' },
      { id: uid(), title: '产能统计', contentType: 'bar' },
    ],
  }
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
    // 过滤掉字段不全的脏数据
    const clean = (arr: unknown[]): EditableCard[] =>
      arr.filter(
        (c): c is EditableCard =>
          !!c && typeof c === 'object' && 'id' in c && 'title' in c && 'contentType' in c,
      )
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

/** 末尾追加一张卡片 */
function addCard(side: Side, contentType: ContentType, title?: string) {
  const meta = getContentTypeMeta(contentType)
  layout.value[side].push({
    id: uid(),
    title: title?.trim() || meta.label,
    contentType,
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

export function useEditLayout() {
  return {
    layout,
    addCard,
    removeCard,
    moveCard,
    updateTitle,
    updateContentType,
    updateSize,
    resetLayout,
  }
}
