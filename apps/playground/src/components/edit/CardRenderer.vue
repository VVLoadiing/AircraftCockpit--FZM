<script setup lang="ts">
/**
 * CardRenderer — 按 contentType 渲染卡片内部内容
 *
 * 接收一个 contentType，输出对应的预置 mock 内容（图表 / 数值 / 列表）。
 * 图表与列表数据统一来自 useChartMocks（与 DashboardView 共用，避免重复）。
 */
import {
  BaseChart,
  KpiItem,
  CountUp,
  MetricBox,
  DataRow,
  TechRow,
  LevelBadge,
  ProgressBar,
} from '@fzm/ui'
import type { ContentType } from '../../composables/useEditLayout'
import { useChartMocks, alertList, dataRows } from '../../composables/useChartMocks'

const props = defineProps<{
  contentType: ContentType
}>()

/* —— 图表 option（来自公共 mock，切主题自动联动配色） —— */
const { lineOption, barOption, pieOption } = useChartMocks()
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
