/**
 * @fzm/ui —— 曜蓝机甲 Tech HUD 组件库
 *
 * 使用方式：
 *  1) 全量注册：app.use(FzmUI)，然后任意模板中直接用 <TechCard /> 等
 *  2) 按需引入：import { TechCard } from '@fzm/ui'
 *
 * 样式引入：import '@fzm/ui/styles'（含设计令牌 + 主题 + 基础 + 动效 + 组件样式）
 */
import type { App, Plugin } from 'vue'

// —— 全局样式（令牌/主题/基础/动效）——必须在入口 import，否则 Vite 库模式不会打包 ——
import './styles/index.css'

// —— 组件 ——
import TechCard from './components/TechCard'
import GlassPanel from './components/GlassPanel'
import FzGlass, { FzGlassTitle, FzGlassRow, FzGlassClose } from './components/FzGlass'
import KpiItem from './components/KpiItem'
import StatusDot from './components/StatusDot'
import CountBadge from './components/CountBadge'
import LevelBadge from './components/LevelBadge'
import ProgressBar from './components/ProgressBar'
import HudButton from './components/HudButton'
import HudChip from './components/HudChip'
import MetricBox from './components/MetricBox'
import DataRow from './components/DataRow'
import TechRow from './components/TechRow'
import HudFrame from './components/HudFrame'
import Sidebar from './components/Sidebar'
import BaseChart from './components/BaseChart'
// 输入交互
import TechInput from './components/TechInput'
import TechSelect from './components/TechSelect'
import TechSwitch from './components/TechSwitch'
import IconToggle from './components/IconToggle'
// 导航
import TechTabs from './components/TechTabs'
import Segmented from './components/Segmented'
// 反馈展示
import TechTag from './components/TechTag'
import TechEmpty from './components/TechEmpty'
import LoadingSpinner from './components/LoadingSpinner'
import CountUp from './components/CountUp'
import TechDivider from './components/TechDivider'
import TechAvatar from './components/TechAvatar'

// —— Composables ——
export { useUiTheme, setUiStyle, initUiStyle, uiStyle, currentUiStyle } from './composables/useUiTheme'
export {
  useChartPalette,
  chartPalette,
  chartTooltip,
  withAlpha,
} from './composables/useChartPalette'

// —— 机甲风图表预设 ——
export { buildLineChart, buildBarChart, buildPieChart } from './presets/charts'
export type {
  BuildLineChartOptions,
  BuildBarChartOptions,
  BuildPieChartOptions,
  BuildPieChartDataItem,
} from './presets/charts'

// —— 类型 & 常量 ——
export type { UiStyle, StatusType, SemanticType, LevelType, SidebarWidth, UiStyleOption } from './types'
export { UI_STYLE_OPTIONS } from './types'
export type { ChartPalette, ChartTooltipColors, ChartTooltipOption } from './composables/useChartPalette'

// —— 按需导出组件 ——
export {
  TechCard,
  GlassPanel,
  FzGlass,
  FzGlassTitle,
  FzGlassRow,
  FzGlassClose,
  KpiItem,
  StatusDot,
  CountBadge,
  LevelBadge,
  ProgressBar,
  HudButton,
  HudChip,
  MetricBox,
  DataRow,
  TechRow,
  HudFrame,
  Sidebar,
  BaseChart,
  // 输入交互
  TechInput,
  TechSelect,
  TechSwitch,
  IconToggle,
  // 导航
  TechTabs,
  Segmented,
  // 反馈展示
  TechTag,
  TechEmpty,
  LoadingSpinner,
  CountUp,
  TechDivider,
  TechAvatar,
}

/** 全部组件清单（用于全量注册） */
const components = {
  TechCard,
  GlassPanel,
  FzGlass,
  FzGlassTitle,
  FzGlassRow,
  FzGlassClose,
  KpiItem,
  StatusDot,
  CountBadge,
  LevelBadge,
  ProgressBar,
  HudButton,
  HudChip,
  MetricBox,
  DataRow,
  TechRow,
  HudFrame,
  Sidebar,
  BaseChart,
  // 输入交互
  TechInput,
  TechSelect,
  TechSwitch,
  IconToggle,
  // 导航
  TechTabs,
  Segmented,
  // 反馈展示
  TechTag,
  TechEmpty,
  LoadingSpinner,
  CountUp,
  TechDivider,
  TechAvatar,
}

/** Vue 插件：app.use(FzmUI) 全量注册 */
export const FzmUI: Plugin = {
  install(app: App) {
    for (const [name, comp] of Object.entries(components)) {
      // 注册名统一加 Fzm 前缀，避免与业务组件冲突；
      // 同时也注册原名（如 TechCard）便于书写
      app.component(`Fzm${name}`, comp)
      app.component(name, comp)
    }
  },
}

export default FzmUI
