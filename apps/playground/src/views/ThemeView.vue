<script setup lang="ts">
/**
 * ThemeView — 主题系统专题文档
 *
 * 详解 @fzm-tech-hud/ui 的主题机制：换肤原理、10 套预设详情、切换 API、图表配色联动、
 * 自定义主题步骤、全部 CSS 变量清单。
 * 支持本页实时切换主题预览效果（右上角下拉 / 下方主题卡点击）。
 * 内容源自 packages/ui/src/styles/themes.css 与 composables/useUiTheme.ts。
 */
import { computed } from 'vue'
import DemoBlock from '../components/DemoBlock.vue'
import { useUiTheme, UI_STYLE_OPTIONS, KpiItem, StatusDot, TechCard, ProgressBar, HudButton, CountUp } from '@fzm-tech-hud/ui'
import type { UiStyle } from '@fzm-tech-hud/ui'

const { style: themeStyle, setStyle, options } = useUiTheme()

/** 10 套主题完整详情（主色 / 底色 / 适用场景 / 是否浅色） */
interface ThemeDetail {
  id: UiStyle
  name: string
  color: string
  desc: string
  scene: string
  isLight: boolean
  primary: string
  bgBody: string
  series: string[]
}

const themeDetails: ThemeDetail[] = [
  { id: 'transparent', name: '曜蓝·通透', color: '#6fb2c9', desc: '默认 · 极透卡片底', scene: '通用大屏 / 数字孪生（默认）', isLight: false, primary: '#6fb2c9', bgBody: '#050709', series: ['#6fb2c9', '#6fc9a8', '#e0b85c', '#d87878', '#8fc3d4', '#94d6bd', '#ecca82', '#e09a9a'] },
  { id: 'clear', name: '曜蓝·清晰', color: '#4ea8c8', desc: '高对比实底 · 数据密集', scene: '数据密集型监控大屏', isLight: false, primary: '#4ea8c8', bgBody: '#040608', series: ['#06b6d4', '#34d399', '#fbbf24', '#f87171', '#0ea5e9', '#a3e635', '#fb923c', '#e879f9'] },
  { id: 'green', name: '青空', color: '#22d3ee', desc: '现代 SaaS · Linear 风', scene: 'SaaS / 监控平台', isLight: false, primary: '#22d3ee', bgBody: '#04080a', series: ['#22d3ee', '#34d399', '#fbbf24', '#f87171', '#67e8f9', '#a3e635', '#fb923c', '#e879f9'] },
  { id: 'amber', name: '翠林', color: '#34d399', desc: '能源 / 可持续 / ESG', scene: '能源 / ESG / 环保', isLight: false, primary: '#34d399', bgBody: '#04100a', series: ['#34d399', '#22d3ee', '#fbbf24', '#f87171', '#6ee7b7', '#a3e635', '#fcd34d', '#fca5a5'] },
  { id: 'violet', name: '星云', color: '#a78bfa', desc: 'AI / 智慧中台', scene: 'AI / 智慧中台 / 数据', isLight: false, primary: '#a78bfa', bgBody: '#060410', series: ['#a78bfa', '#34d399', '#fbbf24', '#f87171', '#c4b5fd', '#22d3ee', '#fcd34d', '#fca5a5'] },
  { id: 'crimson', name: '晨曦', color: '#fb923c', desc: '设备监控 / 产线 / 能耗', scene: '设备监控 / 产线 / 能耗', isLight: false, primary: '#fb923c', bgBody: '#0c0604', series: ['#fb923c', '#34d399', '#fbbf24', '#f87171', '#fdba74', '#22d3ee', '#fcd34d', '#fca5a5'] },
  { id: 'rose', name: '玫境', color: '#fb7185', desc: '品牌 / 安防 / 应急', scene: '品牌 / 安防 / 应急', isLight: false, primary: '#fb7185', bgBody: '#0c0406', series: ['#fb7185', '#34d399', '#fbbf24', '#f87171', '#fda4af', '#22d3ee', '#fcd34d', '#fca5a5'] },
  { id: 'indigo', name: '星钻', color: '#818cf8', desc: '高端未来感', scene: '高端 / 未来感 / 科技', isLight: false, primary: '#818cf8', bgBody: '#060618', series: ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#a5b4fc', '#22d3ee', '#fcd34d', '#fca5a5'] },
  { id: 'light-cyan', name: '冰白·曜蓝', color: '#0891b2', desc: '白色主题 · 科技蓝青主色', scene: '白天模式 / 明亮环境', isLight: true, primary: '#0891b2', bgBody: '#eef3f7', series: ['#0891b2', '#059669', '#d97706', '#dc2626', '#0ea5e9', '#10b981', '#f59e0b', '#e11d48'] },
  { id: 'light-emerald', name: '冰白·翡翠', color: '#059669', desc: '白色主题 · 深翠绿主色', scene: '白天模式 / 能源环保', isLight: true, primary: '#059669', bgBody: '#eef5f1', series: ['#059669', '#0891b2', '#d97706', '#dc2626', '#10b981', '#0ea5e9', '#f59e0b', '#e11d48'] },
]

/** 当前主题详情（用于预览区配色展示） */
const current = computed(() => themeDetails.find((t) => t.id === themeStyle.value) ?? themeDetails[0])

/** 切换主题 */
function apply(id: UiStyle) {
  setStyle(id)
}

// —— 各段代码示例 ——
const basicCode = `<script setup lang="ts">
import { useUiTheme } from '@fzm-tech-hud/ui'
import type { UiStyle } from '@fzm-tech-hud/ui'

const { style, setStyle, options } = useUiTheme()

// style.value 为当前主题 id（响应式）
// setStyle('green') 切换主题（自动写 localStorage + 同步 <html data-ui-style>）
function onChange(v: UiStyle) {
  setStyle(v)
}
<\/script>`

const initCode = `// main.ts
import { createApp } from 'vue'
import FzmUI, { initUiStyle } from '@fzm-tech-hud/ui'
import '@fzm-tech-hud/ui/styles'
import App from './App.vue'

// App 启动即把 localStorage 里已存的主题恢复到 <html data-ui-style>
initUiStyle()

createApp(App).use(FzmUI).mount('#app')`

const domCode = `<!-- JS 切换主题本质就是改这个属性 -->
<html data-ui-style="green">
  <!-- 内部所有组件读取覆盖后的 CSS 变量，整页换肤 -->`

const manualCode = `// 不依赖组件库，纯手动切换（例如 jQuery / 原生项目）
document.documentElement.setAttribute('data-ui-style', 'green')
localStorage.setItem('uiStyle', 'green')`

const customCode = `/* 在自己的项目里新增一套主题（例如 "brand"） */
/* 1. 扩展类型（可选，便于 TS 提示） */
/* 2. 在全局 CSS 里加一个 :root[data-ui-style='brand'] 块，覆盖需要变化的变量 */
:root[data-ui-style='brand'] {
  /* 主色族（primary 系列驱动按钮/边框/辉光/链接） */
  --primary: #ff6a00;
  --primary-rgb: 255, 106, 0;
  --primary-dark: #c2410c;
  --primary-light: #fb923c;
  --primary-lighter: #fed7aa;
  --accent: #ea580c;
  --accent-rgb: 234, 88, 12;
  --accent-light: #f97316;

  /* 卡片底色（建议带透明度，叠加场景层） */
  --bg-card: linear-gradient(168deg, rgba(40, 18, 4, 0.86), rgba(40, 18, 4, 0.96));
  --bg-card-strong: rgba(30, 14, 4, 0.98);

  /* 次级文字 */
  --text-secondary: #f2dccc;

  /* 图表配色（轴线 / 分割线 / 多系列序列） */
  --chart-axis: rgba(252, 222, 190, 0.55);
  --chart-label: #ffffff;
  --chart-legend: #f4dccc;
  --chart-split: rgba(252, 222, 190, 0.18);
  --chart-series: #ff6a00, #34d399, #fbbf24, #f87171, #fb923c, #22d3ee, #fcd34d, #fca5a5;
}

/* 3. 切换：setStyle('brand') 或 <html data-ui-style="brand"> */`

const chartCode = `<script setup lang="ts">
import { computed } from 'vue'
import { BaseChart, useChartPalette, withAlpha, buildLineChart } from '@fzm-tech-hud/ui'
import type { EChartsOption } from 'echarts'

const { palette } = useChartPalette()

// palette 是 computed，依赖当前主题；切换主题后自动重算配色
const option = computed<EChartsOption>(() =>
  buildLineChart({
    palette: palette.value,        // 喂入主题色板
    categories: ['周一', '周二', '周三'],
    series: [{ name: '产线A', data: [120, 200, 150] }],
    unit: '件',
  }) as EChartsOption,
)

// 渐变 / 透明度必须用 withAlpha（canvas 无法解析 CSS 变量字符串）
const areaColor = withAlpha(palette.value.primary, 0.18) // 'rgba(255,106,0,0.18)'
<\/script>`

/** CSS 变量分类清单 */
const varGroups = [
  {
    title: '主色族（驱动按钮 / 边框 / 辉光 / 链接）',
    vars: [
      ['--primary', '主色'],
      ['--primary-rgb', '主色 RGB 三元组（用于 rgb(var(--primary-rgb) / α) 透明度写法）'],
      ['--primary-dark', '主色暗调（渐变收尾、按下态）'],
      ['--primary-light', '主色亮调（悬停辉光）'],
      ['--primary-lighter', '主色更亮（高亮文字、选中态）'],
      ['--accent', '强调色（与主色搭配，标题箭标/光柱）'],
      ['--accent-rgb', '强调色 RGB 三元组'],
      ['--accent-light', '强调色亮调'],
    ],
  },
  {
    title: '语义色（状态/等级/类型变体）',
    vars: [
      ['--success / --success-rgb / --success-light', '成功（翠绿）'],
      ['--warning / --warning-rgb / --warning-light', '警告（黄）'],
      ['--danger / --danger-rgb / --danger-light', '危险（红）'],
      ['--status-running-rgb', '运行状态点脉冲翠绿（独立于 success）'],
    ],
  },
  {
    title: '表面层（底色）',
    vars: [
      ['--bg-body', '页面底色（极透纯黑 / 浅色主题的浅灰白）'],
      ['--bg-card', '卡片底（半透明渐变，叠加场景层）'],
      ['--bg-card-strong', '卡片高对比实底'],
      ['--bg-elevated', '悬浮层底色'],
      ['--bg-scene', '3D 场景底色（大屏铺底用浅色）'],
      ['--bg-hover', '悬停底色'],
    ],
  },
  {
    title: '文字',
    vars: [
      ['--text-primary', '主文字'],
      ['--text-secondary', '次级文字'],
      ['--text-muted', '弱化文字'],
      ['--text-on-primary', '主色背景上的文字'],
    ],
  },
  {
    title: '图表配色（canvas，经 useChartPalette 读取）',
    vars: [
      ['--chart-axis', '轴线色'],
      ['--chart-label', '坐标轴文字'],
      ['--chart-legend', '图例文字'],
      ['--chart-split', '分割线'],
      ['--chart-tooltip-bg / -border / -text', '浮层 tooltip 背景/边框/文字'],
      ['--chart-series', '多系列配色（逗号分隔的色值序列）'],
    ],
  },
]
</script>

<template>
  <div class="theme-view">
    <!-- 标题 -->
    <header class="theme-view__header">
      <h1 class="theme-view__title">主题系统</h1>
      <span class="theme-view__badge">10 套预设 · CSS 变量驱动 · 图表联动</span>
    </header>
    <p class="theme-view__lead">
      @fzm-tech-hud/ui 采用 <strong>CSS 变量 + data 属性</strong> 驱动的主题机制：所有组件读取同一套令牌变量，
      切换 <code>&lt;html data-ui-style="xxx"&gt;</code> 即整套换肤，图表配色自动联动。
      内置 <strong>10 套预设</strong>（8 深色 + 2 白色），支持自定义扩展。
    </p>

    <!-- 实时预览（随当前主题变化） -->
    <h2 class="theme-view__section-title">实时预览</h2>
    <p class="theme-view__text">下方组件会随主题实时变化。点击下方任意主题卡片，或在右上角下拉切换：</p>
    <div class="theme-view__preview">
      <div class="theme-view__preview-left">
        <TechCard title="关键指标">
          <div style="display: flex">
            <KpiItem :value="186" label="在线" type="success" />
            <KpiItem :value="12" label="告警" type="warning" />
            <KpiItem :value="94.6" unit="%" label="OEE" type="info" />
          </div>
        </TechCard>
        <TechCard title="状态与进度">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <div style="display: flex; gap: 14px">
              <StatusDot type="running" label="运行" />
              <StatusDot type="error" label="故障" />
            </div>
            <ProgressBar :value="72" type="success" show-t />
          </div>
        </TechCard>
      </div>
      <div class="theme-view__preview-right">
        <div class="theme-view__meta">
          <div class="theme-view__meta-row"><span>当前主题</span><code>{{ current.id }}</code></div>
          <div class="theme-view__meta-row"><span>主色</span><span class="theme-view__swatch" :style="{ background: current.primary }" /></div>
          <div class="theme-view__meta-row"><span>页面底</span><span class="theme-view__swatch" :style="{ background: current.bgBody }" /></div>
          <div class="theme-view__meta-row"><span>类型</span><span>{{ current.isLight ? '白色（浅色）' : '深色' }}</span></div>
        </div>
        <div class="theme-view__series">
          <span class="theme-view__series-label">图表多系列配色</span>
          <div class="theme-view__series-bar">
            <span v-for="(c, i) in current.series" :key="i" :style="{ background: c }" />
          </div>
        </div>
      </div>
    </div>

    <!-- 换肤原理 -->
    <h2 class="theme-view__section-title">换肤原理</h2>
    <p class="theme-view__text">主题机制由三层协作完成：</p>
    <ol class="theme-view__steps">
      <li>
        <strong>CSS 层</strong>：每套主题在 themes.css 里用
        <code>:root[data-ui-style='xxx']</code> 覆盖需要变化的变量（主色 / 底色 / 文字次色 / 图表色）。
      </li>
      <li>
        <strong>JS 层</strong>：<code>setUiStyle()</code> 改 <code>&lt;html data-ui-style&gt;</code> 属性即触发整套换肤，并写入 localStorage 持久化。
      </li>
      <li>
        <strong>图表层</strong>：<code>useChartPalette</code> 通过 <code>getComputedStyle</code> 把 <code>--chart-*</code> 变量读成 JS 对象，依赖主题状态，切换后自动重算喂给 ECharts。
      </li>
    </ol>
    <DemoBlock :source="domCode" />

    <!-- 切换 API -->
    <h2 class="theme-view__section-title">切换 API</h2>
    <h3 class="theme-view__h3">组合式函数 useUiTheme</h3>
    <DemoBlock :source="basicCode" />

    <h3 class="theme-view__h3">启动时恢复主题</h3>
    <p class="theme-view__text">App 启动时调用 <code>initUiStyle()</code>，把 localStorage 里已存的主题恢复到 DOM，避免刷新闪烁：</p>
    <DemoBlock :source="initCode" />

    <h3 class="theme-view__h3">不依赖组件库的手动切换</h3>
    <p class="theme-view__text">主题本质是 data 属性 + CSS 变量，即使不用 Vue 也能切换：</p>
    <DemoBlock :source="manualCode" />

    <!-- API 返回值表 -->
    <h3 class="theme-view__h3">useUiTheme 返回值</h3>
    <table class="api-table">
      <thead><tr><th>成员</th><th>类型</th><th>说明</th></tr></thead>
      <tbody>
        <tr><td><code>style</code></td><td>Ref&lt;UiStyle&gt;</td><td>当前主题 id（响应式）</td></tr>
        <tr><td><code>current</code></td><td>ComputedRef&lt;UiStyleOption&gt;</td><td>当前主题元信息（id/name/color/desc）</td></tr>
        <tr><td><code>options</code></td><td>UiStyleOption[]</td><td>全部 10 套主题选项</td></tr>
        <tr><td><code>setStyle(id)</code></td><td>(id: UiStyle) =&gt; void</td><td>切换主题（写 localStorage + 同步 DOM）</td></tr>
        <tr><td><code>init()</code></td><td>() =&gt; void</td><td>把已存主题恢复到 DOM（启动调用）</td></tr>
      </tbody>
    </table>

    <!-- 10 套主题详情 -->
    <h2 class="theme-view__section-title">10 套主题预设</h2>
    <p class="theme-view__text">点击卡片可实时切换。8 深色 + 2 白色，每套覆盖主色族、底色、文字次色、图表配色。</p>
    <div class="theme-view__themes">
      <button
        v-for="t in themeDetails"
        :key="t.id"
        type="button"
        class="theme-card"
        :class="{ 'is-active': themeStyle === t.id, 'is-light': t.isLight }"
        @click="apply(t.id)"
      >
        <div class="theme-card__head">
          <span class="theme-card__color" :style="{ background: t.color }" />
          <span class="theme-card__name">{{ t.name }}</span>
          <span v-if="t.isLight" class="theme-card__light-tag">白</span>
        </div>
        <code class="theme-card__id">{{ t.id }}</code>
        <p class="theme-card__desc">{{ t.desc }}</p>
        <p class="theme-card__scene">适用：{{ t.scene }}</p>
        <div class="theme-card__palette">
          <span v-for="(c, i) in t.series.slice(0, 5)" :key="i" :style="{ background: c }" />
        </div>
      </button>
    </div>

    <!-- 图表联动 -->
    <h2 class="theme-view__section-title">图表配色联动</h2>
    <p class="theme-view__text">
      ECharts 画在 <code>&lt;canvas&gt;</code> 上，无法直接读取 CSS 变量。
      <code>useChartPalette</code> 把 <code>--chart-*</code> 变量转成 JS 对象，依赖主题状态，
      切换主题后图表配色自动重算。涉及渐变/透明度时，用 <code>withAlpha()</code> 把颜色转成 <code>rgba()</code>（canvas 无法解析 CSS 变量字符串）。
    </p>
    <DemoBlock :source="chartCode" />

    <!-- 自定义主题 -->
    <h2 class="theme-view__section-title">自定义主题</h2>
    <p class="theme-view__text">在自己的项目里新增一套主题，只需 3 步：</p>
    <ol class="theme-view__steps">
      <li>在全局 CSS 加一个 <code>:root[data-ui-style='你的id']</code> 块，覆盖需要变化的变量。</li>
      <li>（可选）扩展 <code>UiStyle</code> 类型联合，便于 TS 提示。</li>
      <li>用 <code>setStyle('你的id')</code> 或直接设 <code>&lt;html data-ui-style="你的id"&gt;</code> 切换。</li>
    </ol>
    <DemoBlock :source="customCode" />

    <!-- CSS 变量清单 -->
    <h2 class="theme-view__section-title">CSS 变量清单</h2>
    <p class="theme-view__text">自定义主题时，按需覆盖以下变量（未覆盖的沿用默认令牌值）：</p>
    <section v-for="g in varGroups" :key="g.title" class="theme-view__var-group">
      <h3 class="theme-view__h3">{{ g.title }}</h3>
      <table class="api-table">
        <thead><tr><th>变量</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="(row, i) in g.vars" :key="i">
            <td><code>{{ row[0] }}</code></td>
            <td>{{ row[1] }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.theme-view {
  max-width: 960px;
  margin: 0 auto;
  padding: 8px 0 60px;
}

/* —— 标题 —— */
.theme-view__header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.theme-view__title {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: var(--text-primary);
  text-shadow: 0 0 16px rgb(var(--primary-rgb) / 0.45);
}

.theme-view__badge {
  padding: 3px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--primary-lighter);
  background: rgb(var(--primary-rgb) / 0.15);
  border: 1px solid rgb(var(--primary-rgb) / 0.4);
  border-radius: 999px;
}

.theme-view__lead {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
}

.theme-view__text {
  margin: 0 0 14px;
  font-size: 13px;
  line-height: 1.75;
  color: var(--text-secondary);
}

.theme-view__lead code,
.theme-view__text code {
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  color: var(--accent-light);
  background: rgb(var(--primary-rgb) / 0.1);
  padding: 1px 6px;
  border-radius: 4px;
}

/* —— 区块标题 —— */
.theme-view__section-title {
  margin: 36px 0 14px;
  padding-bottom: 8px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--text-primary);
  border-bottom: 1px solid rgb(var(--primary-rgb) / 0.25);
}

.theme-view__h3 {
  margin: 20px 0 10px;
  font-size: 14px;
  font-weight: 700;
  color: var(--accent-light);
}

/* —— 实时预览区 —— */
.theme-view__preview {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
  margin-bottom: 8px;
}

.theme-view__preview-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.theme-view__preview-right {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.theme-view__meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.theme-view__meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
}

.theme-view__meta-row code {
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  color: var(--accent-light);
}

.theme-view__swatch {
  width: 28px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.theme-view__series {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.theme-view__series-label {
  font-size: 11px;
  color: var(--text-muted);
  opacity: 0.8;
}

.theme-view__series-bar {
  display: flex;
  gap: 3px;
  height: 18px;
}

.theme-view__series-bar span {
  flex: 1;
  border-radius: 3px;
}

/* —— 步骤列表 —— */
.theme-view__steps {
  margin: 0 0 14px;
  padding-left: 22px;
  font-size: 13px;
  line-height: 1.85;
  color: var(--text-secondary);
}

.theme-view__steps li {
  margin-bottom: 6px;
}

.theme-view__steps strong {
  color: var(--text-primary);
}

.theme-view__steps code {
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  color: var(--accent-light);
  background: rgb(var(--primary-rgb) / 0.1);
  padding: 1px 6px;
  border-radius: 4px;
}

/* —— 主题卡片墙 —— */
.theme-view__themes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 12px;
  margin-bottom: 8px;
}

.theme-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  color: var(--text-secondary);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.theme-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
}

.theme-card.is-active {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent), 0 0 20px rgb(var(--primary-rgb) / 0.35);
}

.theme-card__head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-card__color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
  flex-shrink: 0;
}

.theme-card__name {
  font-size: 13px;
  font-weight: 800;
  color: var(--text-primary);
}

.theme-card__light-tag {
  margin-left: auto;
  padding: 1px 6px;
  font-size: 9px;
  font-weight: 700;
  color: #1a2b3a;
  background: #fff;
  border-radius: 999px;
}

.theme-card__id {
  align-self: flex-start;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  color: var(--accent-light);
  background: rgb(var(--primary-rgb) / 0.1);
  padding: 1px 7px;
  border-radius: 4px;
}

.theme-card__desc {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: var(--text-secondary);
}

.theme-card__scene {
  margin: 0;
  font-size: 10.5px;
  color: var(--text-muted);
  opacity: 0.75;
}

.theme-card__palette {
  display: flex;
  gap: 3px;
  margin-top: 4px;
  height: 8px;
}

.theme-card__palette span {
  flex: 1;
  border-radius: 2px;
}

/* —— API 表 —— */
.theme-view__var-group {
  margin-bottom: 24px;
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}

.api-table th {
  padding: 8px 12px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-secondary);
  background: rgb(var(--primary-rgb) / 0.08);
  border-bottom: 1px solid var(--border-color);
}

.api-table td {
  padding: 9px 12px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  vertical-align: top;
  line-height: 1.6;
}

.api-table tr:last-child td {
  border-bottom: none;
}

.api-table code {
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  color: var(--accent-light);
  background: rgb(var(--primary-rgb) / 0.1);
  padding: 1px 6px;
  border-radius: 4px;
  word-break: break-word;
}

@media (max-width: 720px) {
  .theme-view__preview {
    grid-template-columns: 1fr;
  }
}
</style>
