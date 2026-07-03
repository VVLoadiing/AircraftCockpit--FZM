/**
 * 公共类型定义
 */

/** 10 套主题预设 id（8 深色 + 2 白色） */
export type UiStyle =
  | 'transparent' // 曜蓝·通透（默认）
  | 'clear' // 曜蓝·清晰
  | 'green' // 青空
  | 'amber' // 翠林
  | 'violet' // 星云
  | 'crimson' // 晨曦
  | 'rose' // 玫境
  | 'indigo' // 星钻
  | 'light-cyan' // 冰白·曜蓝（白底 + 科技蓝青主色）
  | 'light-emerald' // 冰白·翡翠（白底 + 深翠绿主色）

/** 状态点类型（第 7.7 节） */
export type StatusType =
  | 'running' // 运行（脉冲翠绿）
  | 'standby' // 待机
  | 'stopped' // 停止
  | 'error' // 错误（闪烁）
  | 'maintenance' // 维护
  | 'offline' // 离线

/** 语义色类型 */
export type SemanticType = 'success' | 'warning' | 'danger' | 'info'

/** 告警等级（第 7.8 节） */
export type LevelType = 'high' | 'mid' | 'low'

/** 侧栏宽度变体（第 8.3 节） */
export type SidebarWidth = 'normal' | 'narrow' | 'wide'

/** 主题元信息（供主题切换器使用） */
export interface UiStyleOption {
  id: UiStyle
  name: string
  color: string
  desc: string
}

/** 全部主题选项（与 themes.css 一一对应） */
export const UI_STYLE_OPTIONS: UiStyleOption[] = [
  { id: 'transparent', name: '曜蓝·通透', color: '#6fb2c9', desc: '默认 · 极透卡片底' },
  { id: 'clear', name: '曜蓝·清晰', color: '#4ea8c8', desc: '高对比实底 · 数据密集' },
  { id: 'green', name: '青空', color: '#22d3ee', desc: '现代 SaaS · Linear 风' },
  { id: 'amber', name: '翠林', color: '#34d399', desc: '能源 / 可持续 / ESG' },
  { id: 'violet', name: '星云', color: '#a78bfa', desc: 'AI / 智慧中台' },
  { id: 'crimson', name: '晨曦', color: '#fb923c', desc: '设备监控 / 产线 / 能耗' },
  { id: 'rose', name: '玫境', color: '#fb7185', desc: '品牌 / 安防 / 应急' },
  { id: 'indigo', name: '星钻', color: '#818cf8', desc: '高端未来感' },
  { id: 'light-cyan', name: '冰白·曜蓝', color: '#0891b2', desc: '白色主题 · 科技蓝青主色' },
  { id: 'light-emerald', name: '冰白·翡翠', color: '#059669', desc: '白色主题 · 深翠绿主色' },
]
