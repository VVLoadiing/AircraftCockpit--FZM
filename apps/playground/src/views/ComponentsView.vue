<script setup lang="ts">
import {
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
} from '@fzm/ui'
</script>

<template>
  <div class="components-view">
    <TechCard title="TechCard · 切角科技面板" class="components-view__block">
      <p class="components-view__desc">
        最核心容器。切角 + 顶部扫光线 + 左切角斜边高亮 + 左侧纵向光柱。
        带可选的科技横幅条标题。
      </p>
      <div class="components-view__demo">
        <TechCard title="设备概览" style="max-width: 260px">
          <DataRow label="型号" value="FX-3200" />
          <DataRow label="位置" value="A 区 03 工位" />
          <DataRow label="负责人" value="张工" />
        </TechCard>
        <TechCard title="无 hover 辉光" :hoverable="false" style="max-width: 260px">
          <p>设置 hoverable=false 可关闭悬停辉光，适合静态展示。</p>
        </TechCard>
      </div>
    </TechCard>

    <TechCard title="GlassPanel / FzGlass · 玻璃浮层" class="components-view__block">
      <p class="components-view__desc">
        GlassPanel 用于场景叠加的切角玻璃浮层；FzGlass 为弹窗/详情卡的统一外观。
      </p>
      <div class="components-view__demo">
        <GlassPanel style="padding: 14px; width: 240px">
          <strong style="font-size: 12px">GlassPanel</strong>
          <p style="font-size: 11px; color: var(--text-secondary); margin: 6px 0 0">
            八边形切角 + 16px 背景模糊，适合 3D 场景之上的浮层。
          </p>
        </GlassPanel>

        <FzGlass style="padding: 14px; width: 280px">
          <FzGlassTitle title="设备详情 · FX-3200" />
          <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 10px">
            <FzGlassRow label="运行时长" value="1,284h" />
            <FzGlassRow label="当前温度" value="68℃" />
            <FzGlassRow label="健康度" value="96%" />
          </div>
          <div style="display: flex; justify-content: flex-end; margin-top: 12px">
            <FzGlassClose />
          </div>
        </FzGlass>
      </div>
    </TechCard>

    <TechCard title="KpiItem · KPI 大数字" class="components-view__block">
      <div class="components-view__demo components-view__demo--inline">
        <KpiItem :value="186" label="在线设备" type="success" />
        <KpiItem :value="12" label="告警数" type="warning" />
        <KpiItem :value="3" label="故障数" type="danger" />
        <KpiItem :value="94.6" unit="%" label="OEE" type="info" />
        <KpiItem :value="1284" label="今日产量" />
      </div>
    </TechCard>

    <TechCard title="StatusDot · 状态点" class="components-view__block">
      <div class="components-view__demo components-view__demo--inline">
        <StatusDot type="running" label="运行" />
        <StatusDot type="standby" label="待机" />
        <StatusDot type="stopped" label="停止" />
        <StatusDot type="error" label="故障" />
        <StatusDot type="maintenance" label="维护" />
        <StatusDot type="offline" label="离线" />
      </div>
    </TechCard>

    <TechCard title="Badge · 徽章" class="components-view__block">
      <div class="components-view__demo components-view__demo--inline">
        <CountBadge :value="99" />
        <CountBadge :value="12" type="warning" />
        <CountBadge :value="3" type="danger" />
        <CountBadge value="OK" type="success" />
        <LevelBadge level="high" text="高危" />
        <LevelBadge level="mid" text="中危" />
        <LevelBadge level="low" text="低危" />
      </div>
    </TechCard>

    <TechCard title="ProgressBar · 切角流光进度条" class="components-view__block">
      <div style="display: flex; flex-direction: column; gap: 12px">
        <ProgressBar :value="42" type="info" show-text />
        <ProgressBar :value="68" type="success" show-text />
        <ProgressBar :value="85" type="warning" show-text />
        <ProgressBar :value="23" type="danger" show-text />
        <ProgressBar :value="100" :shimmer="false" />
      </div>
    </TechCard>

    <TechCard title="HudButton / HudChip · HUD 按钮与提示" class="components-view__block">
      <div class="components-view__demo components-view__demo--inline">
        <HudButton>默认</HudButton>
        <HudButton type="primary">主操作</HudButton>
        <HudButton type="success">成功</HudButton>
        <HudButton type="warning">警告</HudButton>
        <HudButton type="danger">危险</HudButton>
        <HudButton disabled>禁用</HudButton>
        <HudChip>DEFAULT</HudChip>
        <HudChip type="success">SUCCESS</HudChip>
        <HudChip type="warning">WARNING</HudChip>
        <HudChip type="danger">DANGER</HudChip>
      </div>
    </TechCard>

    <TechCard title="MetricBox · Mini 统计小方块" class="components-view__block">
      <div class="components-view__demo components-view__metrics">
        <MetricBox :value="1284" unit="件" label="今日产量" type="success" />
        <MetricBox :value="3.2" unit="kWh" label="能耗" type="warning" />
        <MetricBox :value="98.2" unit="%" label="良品率" />
        <MetricBox :value="2.1" unit="%" label="不良率" type="danger" />
      </div>
    </TechCard>

    <TechCard title="DataRow / TechRow · 数据行" class="components-view__block">
      <div class="components-view__demo components-view__two-col">
        <div style="display: flex; flex-direction: column; gap: 2px">
          <DataRow label="设备 ID" value="FX-3200-007" />
          <DataRow label="运行时长" value="1,284h" />
          <DataRow label="最近维护" value="2026-06-28" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px">
          <TechRow active>激活态（左 2px 强调边 + 加深底）</TechRow>
          <TechRow>普通科技列表项</TechRow>
          <TechRow>悬停可见 hover 效果</TechRow>
        </div>
      </div>
    </TechCard>
  </div>
</template>

<style scoped>
.components-view {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 20px;
}

.components-view__block {
  width: 100%;
}

.components-view__desc {
  margin: 0 0 12px;
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.components-view__demo {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
}

.components-view__demo--inline {
  align-items: center;
}

.components-view__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}

.components-view__two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
}
</style>
