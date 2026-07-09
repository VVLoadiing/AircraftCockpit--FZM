/**
 * 机甲风图表预设（Tech HUD Chart Presets）
 *
 * 一行调用返回带「辉光 / 菱形数据点 / 流光轨道 / 中心 KPI / 虚线网格」
 * 的完整 EChartsOption，所有配色取自 useChartPalette，切换主题自动联动。
 *
 * 设计语言：曜蓝机甲 Tech HUD（见 UI设计系统规范.md）
 *   - 线条 / 柱子 / 扇区 shadowBlur 外发光 → 通电感
 *   - 菱形数据点 + 白描边 + 辉光 → HUD 瞄准框感
 *   - 柱状 showBackground 半透轨道 + 顶部高亮
 *   - 环形中心总数 KPI（mono + 辉光）
 *   - dashed 虚线网格 + 极细轴线 → 仪表界面
 *
 * @example
 * import { useChartPalette, buildLineChart } from '@fzm-tech-hud/ui'
 * const { palette } = useChartPalette()
 * const option = buildLineChart({
 *   palette: palette.value,
 *   categories: ['周一','周二','周三'],
 *   series: [{ name: '产线A', data: [120, 200, 150] }],
 * })
 */
import { chartTooltip } from '../composables/useChartPalette'
import type { ChartPalette } from '../composables/useChartPalette'
import { withAlpha } from '../composables/useChartPalette'

/* eslint-disable @typescript-eslint/no-explicit-any */
/** 为降低对 echarts 类型的强耦合，预设统一用 any 返回，由 BaseChart 的 option prop 收敛类型 */
type AnyOption = any

/** 渐变对象构造（canvas 需真实颜色，故用 withAlpha） */
function linearGradient(x: number, y: number, x2: number, y2: number, stops: Array<[number, string]>) {
  return {
    type: 'linear' as const,
    x,
    y,
    x2,
    y2,
    colorStops: stops.map(([offset, color]) => ({ offset, color })),
  }
}

/** 极简科技网格的公共坐标轴配置（dashed 虚线 + 极细轴线 + 无刻度） */
function techAxis(palette: ChartPalette) {
  return {
    axisLine: { lineStyle: { color: palette.axis, width: 1 } },
    axisTick: { show: false },
    axisLabel: { color: palette.label, fontSize: 9, fontFamily: 'inherit' },
    splitLine: { lineStyle: { color: palette.split, type: 'dashed' as const } },
  }
}

// ────────────────────────────────────────────────────────────────
// 1. 折线图：辉光折线 + 菱形数据点 + 面积渐变
// ────────────────────────────────────────────────────────────────
export interface BuildLineChartOptions {
  palette: ChartPalette
  /** 类目轴数据 */
  categories: (string | number)[]
  /** 系列：每条线 name + data，颜色自动从 series 色板轮转 */
  series: Array<{ name: string; data: (number | null)[] }>
  /** 是否平滑（默认 false，HUD 锐利感） */
  smooth?: boolean
  /** 是否显示面积渐变（默认 true） */
  area?: boolean
  /** y 轴单位 */
  unit?: string
}

export function buildLineChart(opts: BuildLineChartOptions): AnyOption {
  const { palette, categories, series, smooth = false, area = true, unit } = opts
  const colors = palette.series

  return {
    backgroundColor: 'transparent',
    grid: { top: 28, right: 14, bottom: 6, left: 4, containLabel: true },
    tooltip: {
      ...chartTooltip.value,
      valueFormatter: unit ? (v: any) => `${v} ${unit}` : undefined,
    },
    legend: {
      top: 0,
      icon: 'diamond',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: palette.legend, fontSize: 9 },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: categories,
      ...techAxis(palette),
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      ...techAxis(palette),
      axisLine: { show: false },
    },
    series: series.map((s, i) => {
      const c = colors[i % colors.length]
      return {
        name: s.name,
        type: 'line',
        smooth,
        // 菱形数据点 + 白描边 + 辉光（HUD 瞄准框感）
        symbol: 'diamond',
        symbolSize: 8,
        // 线条辉光：shadowBlur 主题色外发光 → 通电感
        lineStyle: { color: c, width: 2.5, shadowBlur: 8, shadowColor: withAlpha(c, 0.7) },
        itemStyle: { color: c, borderColor: '#fff', borderWidth: 1.5, shadowBlur: 8, shadowColor: withAlpha(c, 0.8) },
        emphasis: { focus: 'series', scale: 1.3 },
        data: s.data,
        ...(area
          ? {
              areaStyle: {
                color: linearGradient(0, 0, 0, 1, [
                  [0, withAlpha(c, 0.28)],
                  [1, withAlpha(c, 0)],
                ]),
                opacity: 0.9,
              },
            }
          : {}),
      }
    }),
  }
}

// ────────────────────────────────────────────────────────────────
// 2. 柱状图：流光轨道 + 顶部高亮渐变 + 圆角切角感
// ────────────────────────────────────────────────────────────────
export interface BuildBarChartOptions {
  palette: ChartPalette
  categories: (string | number)[]
  series: Array<{ name?: string; data: (number | null)[] }>
  /** 柱子颜色（默认主题色 primary） */
  color?: string
  /** 柱宽占比（默认 45%） */
  barWidth?: string
  /** y 轴单位 */
  unit?: string
  /** 是否横向（默认 false） */
  horizontal?: boolean
}

export function buildBarChart(opts: BuildBarChartOptions): AnyOption {
  const { palette, categories, series, color = palette.primary, barWidth = '45%', unit, horizontal = false } = opts

  const valueAxis = {
    type: 'value' as const,
    ...techAxis(palette),
    axisLine: { show: false },
  }
  const catAxis = {
    type: 'category' as const,
    data: categories,
    ...techAxis(palette),
    splitLine: { show: false },
  }

  return {
    backgroundColor: 'transparent',
    grid: { top: 16, right: 14, bottom: 6, left: 4, containLabel: true },
    tooltip: {
      ...chartTooltip.value,
      valueFormatter: unit ? (v: any) => `${v} ${unit}` : undefined,
    },
    xAxis: horizontal ? valueAxis : catAxis,
    yAxis: horizontal ? catAxis : valueAxis,
    series: series.map((s) => ({
      name: s.name,
      type: 'bar',
      barWidth,
      data: s.data,
      // 流光轨道：背后半透轨道
      showBackground: true,
      backgroundStyle: {
        color: withAlpha(color, 0.08),
        // 轨道也带切角感圆角
        borderRadius: horizontal ? [0, 2, 2, 0] : [2, 2, 0, 0],
      },
      // 柱子：顶部高亮 → 底部半透的渐变 + 辉光 + 顶部圆角（切角感）
      itemStyle: {
        borderRadius: horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0],
        color: horizontal
          ? linearGradient(0, 0, 1, 0, [
              [0, withAlpha(color, 0.3)],
              [1, color],
            ])
          : linearGradient(0, 0, 0, 1, [
              [0, color],
              [1, withAlpha(color, 0.25)],
            ]),
        shadowBlur: 8,
        shadowColor: withAlpha(color, 0.5),
      },
      emphasis: { itemStyle: { shadowBlur: 14 } },
    })),
  }
}

// ────────────────────────────────────────────────────────────────
// 3. 饼图 / 环形图：中心 KPI + 扇区辉光描边
// ────────────────────────────────────────────────────────────────
export interface BuildPieChartDataItem {
  name: string
  value: number
  /** 该项颜色（默认从 series 轮转） */
  color?: string
}

export interface BuildPieChartOptions {
  palette: ChartPalette
  data: BuildPieChartDataItem[]
  /** 是否环形（默认 true） */
  doughnut?: boolean
  /** 中心 KPI 标题（如“总数”） */
  centerLabel?: string
  /** 中心 KPI 数值（不传则自动求和） */
  centerValue?: number | string
  /** 中心数值单位 */
  centerUnit?: string
  /** 中心半径（默认 [46%, 68%]） */
  radius?: [string, string]
}

export function buildPieChart(opts: BuildPieChartOptions): AnyOption {
  const {
    palette,
    data,
    doughnut = true,
    centerLabel = '',
    centerValue,
    centerUnit = '',
    radius = ['46%', '68%'],
  } = opts

  const colors = palette.series
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const showVal = centerValue !== undefined ? centerValue : total
  const isNum = typeof showVal === 'number'

  return {
    backgroundColor: 'transparent',
    tooltip: { ...chartTooltip.value, trigger: 'item' },
    legend: {
      bottom: 0,
      icon: 'circle',
      itemWidth: 7,
      itemHeight: 7,
      textStyle: { color: palette.legend, fontSize: 9 },
    },
    // 环形中心 KPI：大数字（mono + 辉光） + 小标签
    title: doughnut
      ? {
          text: `{val|${showVal}${isNum ? centerUnit : ''}}`,
          subtext: centerLabel,
          left: '50%',
          top: '38%',
          textAlign: 'center',
          textVerticalAlign: 'auto',
          textStyle: {
            rich: {
              val: {
                fontSize: 22,
                fontWeight: 800,
                fontFamily: 'monospace',
                color: '#fff',
                textShadowColor: withAlpha(palette.primary, 0.55),
                textShadowBlur: 12,
              },
            },
          },
          subtextStyle: {
            color: palette.legend,
            fontSize: 10,
            fontWeight: 600,
            padding: [6, 0, 0, 0],
          },
        }
      : undefined,
    series: [
      {
        type: 'pie',
        radius: doughnut ? radius : '65%',
        center: ['50%', doughnut ? '46%' : '50%'],
        avoidLabelOverlap: false,
        // 扇区辉光描边 + 间隙分隔 + 大圆角（花瓣/胶囊感）
        itemStyle: {
          borderColor: palette.tooltip.bg,
          borderWidth: 2,
          shadowBlur: 12,
          shadowColor: withAlpha(palette.primary, 0.4),
          borderRadius: 14,
        },
        label: { show: false },
        labelLine: { show: false },
        emphasis: {
          scale: true,
          scaleSize: 6,
          itemStyle: { shadowBlur: 18, shadowColor: withAlpha(palette.primary, 0.6) },
          label: {
            show: true,
            position: 'outside',
            color: palette.label,
            fontSize: 10,
            formatter: '{b}\n{d}%',
          },
        },
        data: data.map((d, i) => ({
          name: d.name,
          value: d.value,
          itemStyle: { color: d.color ?? colors[i % colors.length] },
        })),
      },
    ],
  }
}
