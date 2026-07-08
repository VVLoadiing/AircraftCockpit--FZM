<script setup lang="ts">
/**
 * ComponentsView — 组件演示
 * 逐个组件的可交互 demo，每个 demo 卡片带 id（comp-xxx）供跳转定位。
 * 从大屏 / 总览页点组件名后，App 设置 pendingAnchor，本视图 watch 到即滚动
 * 定位 + 高亮闪烁，并 emit('consumed') 通知 App 清空锚点（避免同锚点二次跳转失效）。
 */
import { ref, watch, nextTick } from 'vue'
import {
  TechCard,
  BaseChart,
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
  // 新增：输入交互
  TechInput,
  TechSelect,
  TechSwitch,
  IconToggle,
  // 新增：导航
  TechTabs,
  Segmented,
  // 新增：反馈展示
  TechTag,
  TechEmpty,
  LoadingSpinner,
  CountUp,
  TechDivider,
  TechAvatar,
  // 主题下拉演示
  useUiTheme,
  UI_STYLE_OPTIONS,
} from '@fzm/ui'
import { useChartMocks } from '../composables/useChartMocks'

// App 传入的待跳转锚点（点击大屏/总览组件名后触发）
const props = defineProps<{ pendingAnchor?: string }>()
const emit = defineEmits<{ (e: 'consumed'): void }>()

// 监听锚点变化，滚动到对应组件 demo
watch(
  () => props.pendingAnchor,
  async (anchor) => {
    if (!anchor) return
    await nextTick()
    const el = document.getElementById(`comp-${anchor}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // 高亮闪烁，提示定位到的卡片
      el.classList.add('is-highlight')
      setTimeout(() => el.classList.remove('is-highlight'), 1600)
    }
    emit('consumed') // 通知 App 清空锚点
  },
)

// 演示用的响应式状态
const inputValue = ref('FX-3200')
const selectValue = ref('online')
const switchVal = ref(true)
const tabValue = ref('overview')
const segValue = ref('day')
const iconToggle = ref('card')

// 图表 demo 数据（来自公共 mock）
const { lineOption, barOption, pieOption } = useChartMocks()

// 主题下拉演示（带彩色圆点 + 名称 + 描述）
const { style: themeStyle, setStyle } = useUiTheme()
const themeSelectOptions = UI_STYLE_OPTIONS.map((o) => ({
  label: o.name,
  value: o.id,
  color: o.color,
  desc: o.desc,
}))
function dotStyle(color: unknown) {
  return color ? { background: String(color) } : undefined
}
</script>

<template>
  <div class="components-view">
    <TechCard id="comp-tech-card" title="TechCard · 切角科技面板" class="components-view__block">
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

    <TechCard id="comp-glass-panel" title="GlassPanel / FzGlass · 玻璃浮层" class="components-view__block">
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

    <TechCard id="comp-kpi-item" title="KpiItem · KPI 大数字" class="components-view__block">
      <div class="components-view__demo components-view__demo--inline">
        <KpiItem :value="186" label="在线设备" type="success" />
        <KpiItem :value="12" label="告警数" type="warning" />
        <KpiItem :value="3" label="故障数" type="danger" />
        <KpiItem :value="94.6" unit="%" label="OEE" type="info" />
        <KpiItem :value="1284" label="今日产量" />
      </div>
    </TechCard>

    <TechCard id="comp-status-dot" title="StatusDot · 状态点" class="components-view__block">
      <div class="components-view__demo components-view__demo--inline">
        <StatusDot type="running" label="运行" />
        <StatusDot type="standby" label="待机" />
        <StatusDot type="stopped" label="停止" />
        <StatusDot type="error" label="故障" />
        <StatusDot type="maintenance" label="维护" />
        <StatusDot type="offline" label="离线" />
      </div>
    </TechCard>

    <TechCard id="comp-count-badge" title="Badge · 徽章" class="components-view__block">
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

    <TechCard id="comp-progress-bar" title="ProgressBar · 切角流光进度条" class="components-view__block">
      <div style="display: flex; flex-direction: column; gap: 12px">
        <ProgressBar :value="42" type="info" show-text />
        <ProgressBar :value="68" type="success" show-text />
        <ProgressBar :value="85" type="warning" show-text />
        <ProgressBar :value="23" type="danger" show-text />
        <ProgressBar :value="100" :shimmer="false" />
      </div>
    </TechCard>

    <TechCard id="comp-hud-button" title="HudButton / HudChip · HUD 按钮与提示" class="components-view__block">
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

    <TechCard id="comp-metric-box" title="MetricBox · Mini 统计小方块" class="components-view__block">
      <div class="components-view__demo components-view__metrics">
        <MetricBox :value="1284" unit="件" label="今日产量" type="success" />
        <MetricBox :value="3.2" unit="kWh" label="能耗" type="warning" />
        <MetricBox :value="98.2" unit="%" label="良品率" />
        <MetricBox :value="2.1" unit="%" label="不良率" type="danger" />
      </div>
    </TechCard>

    <TechCard id="comp-data-row" title="DataRow / TechRow · 数据行" class="components-view__block">
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

    <!-- ============ 图表封装 ============ -->
    <TechCard id="comp-base-chart" title="BaseChart · ECharts 自适应封装" class="components-view__block">
      <div class="components-view__demo components-view__three-col">
        <div class="components-view__chart"><BaseChart :option="lineOption" /></div>
        <div class="components-view__chart"><BaseChart :option="barOption" /></div>
        <div class="components-view__chart"><BaseChart :option="pieOption" /></div>
      </div>
    </TechCard>

    <!-- ============ 新增：输入交互 ============ -->
    <TechCard id="comp-tech-input" title="TechInput / TechSelect / TechSwitch · 输入交互" class="components-view__block">
      <div class="components-view__demo" style="flex-direction: column; align-items: stretch; max-width: 320px; gap: 12px">
        <TechInput v-model="inputValue" placeholder="请输入设备编号" clearable>
          <template #prefix>
            <span style="font-size: 10px">ID</span>
          </template>
        </TechInput>
        <TechInput model-value="" placeholder="禁用状态" disabled />

        <TechSelect
          v-model="selectValue"
          :options="[
            { label: '全部状态', value: 'all' },
            { label: '在线', value: 'online' },
            { label: '离线', value: 'offline', disabled: true },
            { label: '维护中', value: 'maintenance' },
          ]"
        />

        <!-- 主题下拉（彩色圆点 + 名称 + 描述，展示 TechSelect 插槽能力） -->
        <div class="components-view__field">
          <label class="components-view__field-label">主题切换下拉（插槽自定义）</label>
          <TechSelect
            :model-value="themeStyle"
            :options="themeSelectOptions"
            @change="(v: string | number) => setStyle(v as any)"
          >
            <template #trigger="{ label }">
              <span style="display: inline-flex; align-items: center; gap: 7px">
                <span class="theme-dot" :style="dotStyle(UI_STYLE_OPTIONS.find((o) => o.id === themeStyle)?.color)" />
                <span>{{ label || '选择主题' }}</span>
              </span>
            </template>
            <template #option="{ option }">
              <span style="display: flex; align-items: center; gap: 7px; width: 100%">
                <span class="theme-dot" :style="dotStyle(option.color)" />
                <b style="font-weight: 600">{{ option.label }}</b>
                <small style="margin-left: auto; opacity: 0.6; font-size: 10px">{{ option.desc }}</small>
              </span>
            </template>
          </TechSelect>
        </div>

        <div style="display: flex; align-items: center; gap: 16px">
          <span style="font-size: 11px; color: var(--text-secondary)">自动模式</span>
          <TechSwitch v-model="switchVal" />
          <TechSwitch :model-value="false" size="small" />
        </div>

        <IconToggle
          v-model="iconToggle"
          :items="[
            { value: 'card', label: '卡片', icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
            { value: 'list', label: '列表', icon: 'M4 6h16M4 12h16M4 18h16' },
            { value: 'map', label: '地图', icon: 'M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z M12 6a3 3 0 100 6 3 3 0 000-6z' },
          ]"
        />
      </div>
    </TechCard>

    <!-- ============ 新增：导航 ============ -->
    <TechCard id="comp-tech-tabs" title="TechTabs / Segmented · 导航切换" class="components-view__block">
      <TechTabs
        v-model="tabValue"
        :items="[
          { value: 'overview', label: '概览' },
          { value: 'detail', label: '详情' },
          { value: 'log', label: '日志' },
        ]"
        style="margin-bottom: 4px"
      >
        <div v-if="tabValue === 'overview'" style="font-size: 11px; color: var(--text-secondary)">概览面板内容</div>
        <div v-else-if="tabValue === 'detail'" style="font-size: 11px; color: var(--text-secondary)">详情面板内容</div>
        <div v-else style="font-size: 11px; color: var(--text-secondary)">日志面板内容</div>
      </TechTabs>

      <TechDivider />

      <Segmented
        v-model="segValue"
        :items="[
          { value: 'day', label: '日' },
          { value: 'week', label: '周' },
          { value: 'month', label: '月' },
        ]"
      />
    </TechCard>

    <!-- ============ 新增：反馈展示 ============ -->
    <TechCard id="comp-tech-tag" title="TechTag / TechEmpty / LoadingSpinner · 反馈展示" class="components-view__block">
      <div class="components-view__demo components-view__demo--inline" style="margin-bottom: 12px">
        <TechTag>默认</TechTag>
        <TechTag type="success">运行中</TechTag>
        <TechTag type="warning">预警</TechTag>
        <TechTag type="danger" closable>可关闭</TechTag>
      </div>

      <TechDivider>分割线</TechDivider>

      <div class="components-view__demo" style="gap: 24px">
        <TechEmpty description="暂无告警" style="flex: 1; min-width: 0">
          <HudButton type="primary">刷新</HudButton>
        </TechEmpty>
        <LoadingSpinner text="加载中" style="flex: 1; min-width: 0" />
      </div>
    </TechCard>

    <TechCard id="comp-count-up" title="CountUp / TechAvatar · 数字滚动与头像" class="components-view__block">
      <div class="components-view__demo components-view__demo--inline" style="gap: 24px">
        <CountUp :value="1284" suffix="件" type="success" />
        <CountUp :value="94.6" :decimals="1" suffix="%" type="warning" />
        <CountUp :value="38" suffix="ms" />
      </div>
      <TechDivider />
      <div class="components-view__demo components-view__demo--inline" style="gap: 12px">
        <TechAvatar text="设备A" :size="40" status="running" />
        <TechAvatar text="Zhang" :size="40" shape="circle" status="standby" />
        <TechAvatar text="仓W2" :size="40" status="error" />
        <TechAvatar src="" text="机房" :size="40" status="offline" />
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
  /* 锚点定位时留出顶部空间，避免被浮条遮挡 */
  scroll-margin-top: 16px;
  transition: box-shadow 0.3s ease, outline-color 0.3s ease;
  outline: 2px solid transparent;
  outline-offset: 4px;
}

/* 跳转定位后的高亮闪烁提示 */
.components-view__block.is-highlight {
  outline-color: var(--primary);
  box-shadow: 0 0 24px rgb(var(--primary-rgb) / 0.5);
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

/* 图表 demo：三列等宽，每张固定高度 */
.components-view__three-col {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  width: 100%;
}

.components-view__chart {
  height: 160px;
}

/* 主题下拉演示 */
.components-view__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.components-view__field-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  opacity: 0.7;
}

.theme-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
