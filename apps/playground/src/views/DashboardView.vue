<script setup lang="ts">
/**
 * DashboardView — 大屏组装示例
 * 3D 场景占位铺底 + 双侧栏浮层 + 顶部 KPI。
 * 各组件区域可用 JumpLink 包裹，点击跳转到组件演示页（hover 显示提示）。
 */
import { computed } from 'vue'
import {
  BaseChart,
  useChartPalette,
  buildLineChart,
  buildBarChart,
  buildPieChart,
  TechCard,
  Sidebar,
  KpiItem,
  StatusDot,
  DataRow,
  TechRow,
  LevelBadge,
  ProgressBar,
  MetricBox,
  CountBadge,
} from '@fzm/ui'
import type { EChartsOption } from 'echarts'
import JumpLink from '../components/JumpLink.vue'

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

const alertList = [
  { level: 'high' as const, text: '3#注塑机 温度超限 92℃', time: '12:04:21' },
  { level: 'mid' as const, text: 'B 区冷却水压偏低', time: '12:01:08' },
  { level: 'low' as const, text: '7#传送带 计划维护', time: '11:58:33' },
  { level: 'high' as const, text: '仓储 W2 烟感报警', time: '11:50:17' },
  { level: 'mid' as const, text: '主产线 节拍偏差 +6%', time: '11:42:05' },
  { level: 'low' as const, text: 'A 区环境湿度偏高', time: '11:35:50' },
  { level: 'mid' as const, text: '5#机械臂 振动异常', time: '11:28:12' },
  { level: 'high' as const, text: '配电柜 P3 电压波动', time: '11:20:44' },
  { level: 'low' as const, text: '2#注塑机 待料停机', time: '11:15:09' },
  { level: 'mid' as const, text: '冷却塔 风机停转', time: '11:02:31' },
]
</script>

<template>
  <div class="dashboard">
    <!-- 左侧栏（透明浮层，贴左边铺满高度） -->
    <Sidebar class="dashboard__sidebar dashboard__sidebar--left">
      <TechCard title="实时产线趋势" fill>
        <div class="dashboard__chart">
          <BaseChart :option="lineOption"/>
        </div>
      </TechCard>

      <TechCard title="设备状态分布" fill>
        <div class="dashboard__chart">
          <BaseChart :option="pieOption" />
        </div>
      </TechCard>
    </Sidebar>

    <!-- 中间顶部 KPI 浮条 -->
    <JumpLink to="kpi-item" label="KpiItem" class="dashboard__kpi-jump">
      <div class="dashboard__kpi-bar">
        <KpiItem :value="2" :unit="'/3'" label="产线" type="success" />
        <KpiItem :value="186" label="设备在线" type="info" />
        <KpiItem :value="94.6" unit="%" label="综合效率 OEE" type="success" />
        <KpiItem :value="12" label="告警数" type="warning" />
        <KpiItem :value="3" label="故障数" type="danger" />
      </div>
    </JumpLink>

    <!-- 右侧栏 -->
    <Sidebar class="dashboard__sidebar dashboard__sidebar--right">
      <!-- 告警列表：限制内容区最大高度，超出滚动；标题固定不动 -->
      <JumpLink to="data-row" label="TechRow / LevelBadge">
        <TechCard title="告警列表" fill>
          <TechRow v-for="(a, i) in alertList" :key="i" :active="i === 0">
            <template #prefix>
              <LevelBadge :level="a.level" />
            </template>
            {{ a.text }}
            <template #suffix>
              <span class="dashboard__alert-time">{{ a.time }}</span>
            </template>
          </TechRow>
        </TechCard>
      </JumpLink>

      <TechCard title="产能统计" fill>
        <div class="dashboard__chart">
          <BaseChart :option="barOption" />
        </div>
      </TechCard>

      <JumpLink to="metric-box" label="MetricBox">
        <TechCard title="核心指标" fill>
          <div class="dashboard__metrics">
            <MetricBox :value="1284" label="今日产量" unit="件" type="success" />
            <MetricBox :value="3.2" label="能耗" unit="kWh" type="warning" />
            <MetricBox :value="98.2" label="良品率" unit="%" />
          </div>
        </TechCard>
      </JumpLink>
    </Sidebar>

    <!-- 底部状态浮条 -->
    <JumpLink to="status-dot" label="StatusDot / DataRow / ProgressBar" class="dashboard__bottom-jump">
      <div class="dashboard__bottom">
        <div class="dashboard__bottom-left">
          <StatusDot type="running" label="系统运行中" />
          <DataRow label="数据延迟" value="38ms" />
          <DataRow label="接入设备" value="186 / 200" />
        </div>
        <div class="dashboard__bottom-right">
          <CountBadge :value="99.9" type="success" /> 系统可用性
          <ProgressBar :value="78" type="info" style="width: 160px" />
        </div>
      </div>
    </JumpLink>
  </div>
</template>

<style scoped>
/*
 * 布局原则（对应设计文档第 8.2 节）：
 * 3D 场景已在 App.vue 全屏铺底，本视图只负责侧栏 / KPI / 底部浮层。
 * 所有浮层用 fixed 定位贴视口边缘，叠加在场景之上。
 */
.dashboard {
  position: fixed;
  inset: 0;
  z-index: 10;
  pointer-events: none; /* 容器不拦截场景交互，子元素各自启用 */
}

.dashboard > * {
  pointer-events: auto;
}

/* —— 左右侧栏（透明浮层，贴边铺满高度，留出顶部 header 空间） —— */
.dashboard__sidebar--left,
.dashboard__sidebar--right {
  position: fixed;
  top: calc(10px + var(--header-h) + 50px);
  bottom: 60px;
  z-index: 12;
}

.dashboard__sidebar--left {
  left: 10px;
}

.dashboard__sidebar--right {
  right: 10px;
}

/* 侧栏内容超出时纵向滚动（穿透到 Sidebar 组件） */
.dashboard__sidebar--left :deep(.fzm-sidebar),
.dashboard__sidebar--right :deep(.fzm-sidebar) {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

/* —— 顶部 KPI 浮条（居中浮于场景之上，在 header 下方） —— */
.dashboard__kpi-jump {
  position: fixed;
  top: calc(10px + var(--header-h) + 50px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 12;
  width: max-content;
  max-width: calc(100% - 2 * var(--sidebar-w) - 40px);
}

.dashboard__bottom-jump {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 12;
  width: max-content;
  max-width: calc(100% - 2 * var(--sidebar-w) - 40px);
}

.dashboard__kpi-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 12px 16px;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: var(--glass-radius);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: var(--glass-shadow);
}

/* —— 底部状态浮条（居中浮于场景之上） —— */
.dashboard__bottom {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 16px;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: var(--glass-radius);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: var(--glass-shadow);
}

.dashboard__bottom-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.dashboard__bottom-right {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-secondary);
}

.dashboard__chart {
  width: 100%;
  height: 100%;
  margin: 0 -4px;
}

.dashboard__metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.dashboard__alert-time {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
  opacity: 0.7;
}
</style>
