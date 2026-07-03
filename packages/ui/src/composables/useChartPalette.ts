/**
 * useChartPalette — ECharts 图表色板读取层
 * 来源：UI设计系统规范.md 第 10 章
 *
 * ECharts 画在 <canvas> 上，无法直接读取 CSS 变量。
 * 本组合式函数通过 getComputedStyle 把 --chart-* 变量转成 JS 对象，
 * 依赖 uiStyle，切换主题后自动重算，喂给图表 option。
 */
import { computed } from 'vue'
import { uiStyle } from './useUiTheme'

export interface ChartTooltipColors {
  bg: string
  border: string
  text: string
}

export interface ChartPalette {
  primary: string
  success: string
  warning: string
  danger: string
  axis: string
  label: string
  legend: string
  split: string
  tooltip: ChartTooltipColors
  /** 多系列配色数组 */
  series: string[]
}

/** 读取单个 CSS 变量，失败回退 */
function cssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

/** 把 --chart-series（逗号分隔色值）解析为数组 */
function cssVarList(name: string, fallback: string[]): string[] {
  const raw = cssVar(name, fallback.join(', '))
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * 把颜色转成指定透明度的 rgba() 字符串。
 * 支持 #rgb / #rrggbb / #rrggbbaa / rgb() / rgba() / hsl() 等格式。
 *
 * 为什么需要它：ECharts 画在 <canvas> 上，addColorStop 无法解析
 * `rgb(var(--primary-rgb) / 0.2)` 这种 CSS 变量字符串。渐变区域、
 * 渐变填充等必须用本函数生成“纯色值 + 透明度”的真实颜色字符串。
 *
 * @example
 * withAlpha('#6fb2c9', 0.18) // 'rgba(111,178,201,0.18)'
 * withAlpha(palette.value.primary, 0.2)
 */
export function withAlpha(color: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha))
  const c = (color || '').trim()

  // 已经是 rgba/rgb/hsla/hsl，直接替换/补透明度
  const m = c.match(/^(rgba?|hsla?)\(([^)]+)\)$/i)
  if (m) {
    const parts = m[2].split(',').map((s) => s.trim())
    // rgba/hsla：第 4 段是透明度，覆盖之
    if (parts.length === 4) {
      parts[3] = String(a)
      return `${m[1]}(${parts.join(',')})`
    }
    // rgb/hsl（3 段）：补上透明度
    return `${m[1]}(${parts.join(',')},${a})`
  }

  // #hex
  const hex = c.replace(/^#/, '')
  let r = 0
  let g = 0
  let b = 0
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  } else if (hex.length === 6 || hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16)
    g = parseInt(hex.slice(2, 4), 16)
    b = parseInt(hex.slice(4, 6), 16)
  } else {
    // 无法解析，原样返回（让 canvas 自己报错，便于定位）
    return color
  }
  return `rgba(${r},${g},${b},${a})`
}

const FALLBACK_SERIES = [
  '#6fb2c9', '#6fc9a8', '#e0b85c', '#d87878',
  '#8fc3d4', '#94d6bd', '#ecca82', '#e09a9a',
]

/** 图表色板（响应式，随主题切换重算） */
export const chartPalette = computed<ChartPalette>(() => {
  // 建立对主题的依赖，切换后失效重算
  void uiStyle.value
  return {
    primary: cssVar('--chart-primary', '#6fb2c9'),
    success: cssVar('--chart-success', '#6fc9a8'),
    warning: cssVar('--chart-warning', '#e0b85c'),
    danger: cssVar('--chart-danger', '#d87878'),
    axis: cssVar('--chart-axis', 'rgba(190,230,255,.55)'),
    label: cssVar('--chart-label', '#ffffff'),
    legend: cssVar('--chart-legend', '#d6e8f7'),
    split: cssVar('--chart-split', 'rgba(190,230,255,.18)'),
    tooltip: {
      bg: cssVar('--chart-tooltip-bg', 'rgba(0,8,18,.82)'),
      border: cssVar('--chart-tooltip-border', 'rgba(111,178,201,.40)'),
      text: cssVar('--chart-tooltip-text', '#eef6ff'),
    },
    series: cssVarList('--chart-series', FALLBACK_SERIES),
  }
})

/**
 * 通用 Tooltip 配置（深色底 + 主题色边框 + blur 圆角）
 * 来源：第 10.4 节
 *
 * 注意：trigger/confine 等字段需保持 ECharts 字面量类型，
 * 否则 string 扩展会与 EChartsOption 不兼容。
 * 这里显式标注 trigger 为字面量联合，避免 computed 推断时被扩展为 string。
 */
export type ChartTooltipOption = {
  trigger: 'item' | 'axis' | 'none'
  backgroundColor: string
  borderColor: string
  borderWidth: number
  textStyle: { color: string; fontSize: number }
  extraCssText: string
  confine: boolean
}

export const chartTooltip = computed<ChartTooltipOption>(() => ({
  trigger: 'axis',
  backgroundColor: chartPalette.value.tooltip.bg,
  borderColor: chartPalette.value.tooltip.border,
  borderWidth: 1,
  textStyle: {
    color: chartPalette.value.tooltip.text,
    fontSize: 11,
  },
  extraCssText:
    'box-shadow:0 8px 24px rgba(0,0,0,.55);border-radius:10px;backdrop-filter:blur(12px);',
  confine: true,
}))

/**
 * 组合式函数：返回图表色板与通用 tooltip
 * @example
 * const { palette, tooltip } = useChartPalette()
 */
export function useChartPalette() {
  return {
    palette: chartPalette,
    tooltip: chartTooltip,
    /** 颜色透明度工具：把任意颜色转成 rgba(hex, α)，供 canvas 渐变使用 */
    withAlpha,
  }
}
