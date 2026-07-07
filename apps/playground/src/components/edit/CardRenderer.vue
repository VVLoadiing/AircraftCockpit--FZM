<script setup lang="ts">
/**
 * CardRenderer — 按 contentType 渲染卡片内部内容
 *
 * 接收一个 contentType，输出对应的预置 mock 内容（图表 / 数值 / 列表）。
 * 图表沿用 DashboardView 的模式：useChartPalette + computed 包 buildXxxChart，
 * 喂给 BaseChart。
 */
import { computed } from 'vue'
import {
  BaseChart,
  useChartPalette,
  buildLineChart,
  buildBarChart,
  buildPieChart,
  KpiItem,
  CountUp,
  MetricBox,
  DataRow,
  TechRow,
  LevelBadge,
  ProgressBar,
} from '@fzm/ui'
import type { EChartsOption } from 'echarts'
import type { ContentType } from '../../composables/useEditLayout'

const props = defineProps<{
  contentType: ContentType
}>()

const { palette } = useChartPalette()

/* —— 图表 option（沿用 DashboardView 现成模式，预置 mock 数据） —— */
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

/* —— 列表类 mock —— */
const dataRows = [
  { label: '数据延迟', value: '38ms' },
  { label: '接入设备', value: '186 / 200' },
  { label: '今日产量', value: '1284 件' },
  { label: '综合效率', value: '94.6%' },
]

const alertList = [
  { level: 'high' as const, text: '3#注塑机 温度超限 92℃', time: '12:04' },
  { level: 'mid' as const, text: 'B 区冷却水压偏低', time: '12:01' },
  { level: 'low' as const, text: '7#传送带 计划维护', time: '11:58' },
  { level: 'mid' as const, text: '5#机械臂 振动异常', time: '11:28' },
]
</script>

<template>
  <!-- 图表类 -->
  <div v-if="props.contentType === 'line'" class="card-render__chart">
    <BaseChart :option="lineOption" />
  </div>

  <div v-else-if="props.contentType === 'bar'" class="card-render__chart">
    <BaseChart :option="barOption" />
  </div>

  <div v-else-if="props.contentType === 'pie'" class="card-render__chart">
    <BaseChart :option="pieOption" />
  </div>

  <!-- 数值 / KPI 类 -->
  <div v-else-if="props.contentType === 'kpi'" class="card-render__kpi-bar">
    <KpiItem :value="186" label="设备在线" type="info" />
    <KpiItem :value="94.6" unit="%" label="综合效率" type="success" />
    <KpiItem :value="12" label="告警数" type="warning" />
    <KpiItem :value="3" label="故障数" type="danger" />
  </div>

  <div v-else-if="props.contentType === 'countup'" class="card-render__countup">
    <CountUp :value="1284" suffix=" 件" type="success" font-size="30" />
    <CountUp :value="98.2" :decimals="1" suffix=" %" type="info" font-size="22" />
    <CountUp :value="3.2" :decimals="1" suffix=" kWh" type="warning" font-size="22" />
  </div>

  <div v-else-if="props.contentType === 'metric'" class="card-render__metric-grid">
    <MetricBox :value="1284" label="今日产量" unit="件" type="success" />
    <MetricBox :value="3.2" label="能耗" unit="kWh" type="warning" />
    <MetricBox :value="98.2" label="良品率" unit="%" />
    <MetricBox :value="12" label="告警" type="danger" />
  </div>

  <!-- 列表 / 行类 -->
  <div v-else-if="props.contentType === 'data-row'" class="card-render__rows">
    <DataRow v-for="(r, i) in dataRows" :key="i" :label="r.label">{{ r.value }}</DataRow>
  </div>

  <div v-else-if="props.contentType === 'tech-row'" class="card-render__rows">
    <TechRow v-for="(a, i) in alertList" :key="i" :active="i === 0">
      <template #prefix>
        <LevelBadge :level="a.level" />
      </template>
      {{ a.text }}
      <template #suffix>
        <span class="card-render__time">{{ a.time }}</span>
      </template>
    </TechRow>
  </div>

  <div v-else-if="props.contentType === 'progress'" class="card-render__progress">
    <div class="card-render__progress-item">
      <span class="card-render__progress-label">CPU 使用率</span>
      <ProgressBar :value="78" show-text type="info" />
    </div>
    <div class="card-render__progress-item">
      <span class="card-render__progress-label">内存占用</span>
      <ProgressBar :value="56" show-text type="success" />
    </div>
    <div class="card-render__progress-item">
      <span class="card-render__progress-label">磁盘容量</span>
      <ProgressBar :value="89" show-text type="warning" />
    </div>
    <div class="card-render__progress-item">
      <span class="card-render__progress-label">带宽负载</span>
      <ProgressBar :value="42" show-text />
    </div>
  </div>
</template>

<style scoped>
.card-render__chart {
  width: 100%;
  height: 100%;
  /* 最小高度下限：尽可能低，让图表在卡片均分到较小高度时仍能按比例缩小。
     ECharts canvas 在 ~80px 高度仍可渲染，故下限放宽，避免卡片"卡住不再缩小"。 */
  min-height: 90px;
  margin: 0 -4px;
}

.card-render__kpi-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
}

.card-render__countup {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 12px 0;
}

.card-render__metric-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.card-render__rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-render__time {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
  opacity: 0.7;
}

.card-render__progress {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 0;
}

.card-render__progress-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-render__progress-label {
  font-size: 11px;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}
</style>
