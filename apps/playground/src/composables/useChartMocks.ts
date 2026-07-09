/**
 * useChartMocks — 图表 / 列表的预置 mock 数据集中点
 *
 * DashboardView（大屏组装示例）与 CardRenderer（编辑模式卡片内容）原本各有一份
 * 几乎相同的 mock（折线 / 柱状 / 饼图 option + 告警列表），改一处忘另一处。
 * 这里统一导出工厂函数，两处共用同一份数据源。
 *
 * 图表 option 用 useChartPalette + buildXxxChart 生成（沿用 @fzm-tech-hud/ui 预设），
 * 返回 computed，切主题时配色自动联动。
 */
import { computed } from 'vue'
import { useChartPalette, buildLineChart, buildBarChart, buildPieChart } from '@fzm-tech-hud/ui'
import type { EChartsOption } from 'echarts'

/** 告警列表（科技列表项 TechRow + LevelBadge 的示例数据） */
export interface AlertItem {
  level: 'high' | 'mid' | 'low'
  text: string
  time: string
}

export const alertList: AlertItem[] = [
  { level: 'high', text: '3#注塑机 温度超限 92℃', time: '12:04' },
  { level: 'mid', text: 'B 区冷却水压偏低', time: '12:01' },
  { level: 'low', text: '7#传送带 计划维护', time: '11:58' },
  { level: 'high', text: '仓储 W2 烟感报警', time: '11:50' },
  { level: 'mid', text: '主产线 节拍偏差 +6%', time: '11:42' },
]

/** 数据键值行（DataRow 的示例数据） */
export const dataRows = [
  { label: '数据延迟', value: '38ms' },
  { label: '接入设备', value: '186 / 200' },
  { label: '今日产量', value: '1284 件' },
  { label: '综合效率', value: '94.6%' },
]

/**
 * 图表 mock option 工厂：返回 { lineOption, barOption, pieOption }，均为 computed，
 * 切主题时由 useChartPalette 自动重算配色。
 */
export function useChartMocks() {
  const { palette } = useChartPalette()

  const lineOption = computed<EChartsOption>(
    () =>
      buildLineChart({
        palette: palette.value,
        categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
        series: [
          { name: '产线A', data: [320, 432, 501, 634, 790, 930, 820] },
          { name: '产线B', data: [220, 282, 391, 434, 590, 530, 420] },
        ],
        unit: '件',
      }) as EChartsOption,
  )

  const barOption = computed<EChartsOption>(
    () =>
      buildBarChart({
        palette: palette.value,
        categories: ['一', '二', '三', '四', '五', '六', '日'],
        series: [{ data: [120, 200, 150, 80, 70, 110, 130] }],
        unit: '件',
      }) as EChartsOption,
  )

  const pieOption = computed<EChartsOption>(
    () =>
      buildPieChart({
        palette: palette.value,
        centerLabel: '设备总数',
        centerUnit: '台',
        data: [
          { name: '正常', value: 1048, color: palette.value.success },
          { name: '告警', value: 335, color: palette.value.warning },
          { name: '故障', value: 124, color: palette.value.danger },
          { name: '离线', value: 187, color: '#64748b' },
        ],
      }) as EChartsOption,
  )

  return { lineOption, barOption, pieOption }
}
