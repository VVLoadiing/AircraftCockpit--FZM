/**
 * 组件文档注册中心
 *
 * 汇总全部组件文档配置 + 分类：
 *  - DocLayout 据此生成左侧分类目录
 *  - ComponentDocView 据 :name 查找 loader 加载文档
 *
 * 每个组件用动态 import 懒加载，路由进入该组件页时才解析，
 * 避免首屏加载全部组件的示例源码。
 */
import type { ComponentDocEntry, CategoryGroup, ComponentCategory } from './types'

/** 分类顺序（决定侧边目录分组顺序） */
const CATEGORY_ORDER: ComponentCategory[] = [
  '基础容器',
  '数据展示',
  '反馈与标识',
  '输入与导航',
  '布局',
]

/** 全部组件文档注册项（懒加载） */
export const componentDocs: ComponentDocEntry[] = [
  // 基础容器
  { name: 'tech-card', title: 'TechCard 科技面板', category: '基础容器', loader: () => import('./components/tech-card.doc') },
  { name: 'glass-panel', title: 'GlassPanel 玻璃浮层', category: '基础容器', loader: () => import('./components/glass-panel.doc') },
  { name: 'fz-glass', title: 'FzGlass 玻璃浮窗', category: '基础容器', loader: () => import('./components/fz-glass.doc') },
  // 数据展示
  { name: 'kpi-item', title: 'KpiItem KPI 大数字', category: '数据展示', loader: () => import('./components/kpi-item.doc') },
  { name: 'count-up', title: 'CountUp 数字滚动', category: '数据展示', loader: () => import('./components/count-up.doc') },
  { name: 'metric-box', title: 'MetricBox 统计方块', category: '数据展示', loader: () => import('./components/metric-box.doc') },
  { name: 'data-row', title: 'DataRow 数据行', category: '数据展示', loader: () => import('./components/data-row.doc') },
  { name: 'tech-row', title: 'TechRow 科技列表项', category: '数据展示', loader: () => import('./components/tech-row.doc') },
  { name: 'tech-tag', title: 'TechTag 科技标签', category: '数据展示', loader: () => import('./components/tech-tag.doc') },
  { name: 'tech-divider', title: 'TechDivider 分割线', category: '数据展示', loader: () => import('./components/tech-divider.doc') },
  { name: 'tech-avatar', title: 'TechAvatar 头像', category: '数据展示', loader: () => import('./components/tech-avatar.doc') },
  { name: 'base-chart', title: 'BaseChart 图表封装', category: '数据展示', loader: () => import('./components/base-chart.doc') },
  { name: 'tech-scroll', title: 'TechScroll 滚动容器', category: '数据展示', loader: () => import('./components/tech-scroll.doc') },
  // 反馈与标识
  { name: 'status-dot', title: 'StatusDot 状态点', category: '反馈与标识', loader: () => import('./components/status-dot.doc') },
  { name: 'count-badge', title: 'CountBadge 计数徽章', category: '反馈与标识', loader: () => import('./components/count-badge.doc') },
  { name: 'level-badge', title: 'LevelBadge 告警等级', category: '反馈与标识', loader: () => import('./components/level-badge.doc') },
  { name: 'progress-bar', title: 'ProgressBar 进度条', category: '反馈与标识', loader: () => import('./components/progress-bar.doc') },
  { name: 'hud-button', title: 'HudButton 按钮', category: '反馈与标识', loader: () => import('./components/hud-button.doc') },
  { name: 'hud-chip', title: 'HudChip 提示标签', category: '反馈与标识', loader: () => import('./components/hud-chip.doc') },
  { name: 'tech-empty', title: 'TechEmpty 空状态', category: '反馈与标识', loader: () => import('./components/tech-empty.doc') },
  { name: 'loading-spinner', title: 'LoadingSpinner 加载中', category: '反馈与标识', loader: () => import('./components/loading-spinner.doc') },
  { name: 'tech-dialog', title: 'TechDialog 对话框', category: '反馈与标识', loader: () => import('./components/tech-dialog.doc') },
  { name: 'tech-message', title: 'Message 消息提示', category: '反馈与标识', loader: () => import('./components/tech-message.doc') },
  { name: 'tech-popconfirm', title: 'Popconfirm 气泡确认框', category: '反馈与标识', loader: () => import('./components/tech-popconfirm.doc') },
  // 输入与导航
  { name: 'tech-input', title: 'TechInput 输入框', category: '输入与导航', loader: () => import('./components/tech-input.doc') },
  { name: 'tech-select', title: 'TechSelect 下拉选择', category: '输入与导航', loader: () => import('./components/tech-select.doc') },
  { name: 'tech-switch', title: 'TechSwitch 开关', category: '输入与导航', loader: () => import('./components/tech-switch.doc') },
  { name: 'icon-toggle', title: 'IconToggle 图标按钮组', category: '输入与导航', loader: () => import('./components/icon-toggle.doc') },
  { name: 'tech-tabs', title: 'TechTabs 标签页', category: '输入与导航', loader: () => import('./components/tech-tabs.doc') },
  { name: 'segmented', title: 'Segmented 分段控制器', category: '输入与导航', loader: () => import('./components/segmented.doc') },
  // 布局
  { name: 'app-header', title: 'AppHeader 应用头部', category: '布局', loader: () => import('./components/app-header.doc') },
  { name: 'hud-frame', title: 'HudFrame HUD 边框', category: '布局', loader: () => import('./components/hud-frame.doc') },
  { name: 'sidebar', title: 'Sidebar 侧栏', category: '布局', loader: () => import('./components/sidebar.doc') },
]

/** 按 name 查找注册项 */
export function findEntry(name: string): ComponentDocEntry | undefined {
  return componentDocs.find((c) => c.name === name)
}

/** 按分类分组的目录（供 DocLayout 侧边栏渲染） */
export const categoryGroups: CategoryGroup[] = CATEGORY_ORDER.map((title) => ({
  title,
  items: componentDocs
    .filter((c) => c.category === title)
    .map((c) => ({ name: c.name, title: c.title })),
})).filter((g) => g.items.length > 0)
