<script setup lang="ts">
/**
 * IntroView — 组件库说明 / 使用指南
 *
 * 文档站首页：介绍 @fzm-tech-hud/ui 的特性、安装、注册方式、主题切换、图表用法、导出 API。
 * 代码块复用 DemoBlock（纯代码模式，默认展开 + 一键复制）。
 * 内容源自 packages/ui/README.md，针对文档站场景优化。
 */
import DemoBlock from '../components/DemoBlock.vue'
import { KpiItem, StatusDot, TechCard, HudButton } from '@fzm-tech-hud/ui'

// —— 各段代码示例（字符串，供 DemoBlock 展示与复制）——
const installCode = `# 安装组件库
pnpm add @fzm-tech-hud/ui

# peer 依赖
pnpm add vue

# 如需图表（BaseChart / 机甲风预设）
pnpm add echarts`

const globalRegisterCode = `// main.ts
import { createApp } from 'vue'
import FzmUI from '@fzm-tech-hud/ui'
import '@fzm-tech-hud/ui/styles'  // ⚠️ 样式需单独引入
import App from './App.vue'

const app = createApp(App)
app.use(FzmUI)
app.mount('#app')`

const onDemandCode = `<script setup lang="ts">
import { TechCard, KpiItem, StatusDot } from '@fzm-tech-hud/ui'
import '@fzm-tech-hud/ui/styles'
<\/script>

<template>
  <TechCard title="关键指标">
    <KpiItem :value="1280" label="在线设备" type="success" />
    <StatusDot type="running" label="运行" />
  </TechCard>
</template>`

const themeCode = `import { useUiTheme } from '@fzm-tech-hud/ui'

const { style, setStyle } = useUiTheme()
// 切换主题（自动写 localStorage + 同步 <html data-ui-style>）
setStyle('green')`

const chartCode = `<script setup lang="ts">
import { computed } from 'vue'
import { BaseChart, useChartPalette, buildLineChart } from '@fzm-tech-hud/ui'
import '@fzm-tech-hud/ui/styles'
import type { EChartsOption } from 'echarts'

const { palette } = useChartPalette()

// 一行生成机甲风折线图（辉光 + 菱形点 + 面积渐变）
const option = computed<EChartsOption>(
  () =>
    buildLineChart({
      palette: palette.value,
      categories: ['周一', '周二', '周三'],
      series: [{ name: '产线A', data: [120, 200, 150] }],
      unit: '件',
    }) as EChartsOption,
)
<\/script>

<template>
  <BaseChart :option="option" height="240px" />
</template>`

const withAlphaCode = `import { withAlpha } from '@fzm-tech-hud/ui'
withAlpha(palette.value.primary, 0.2) // 'rgba(111,178,201,0.2)'`

const publishCode = `# 构建组件库（产出 dist/：fzm-ui.js / fzm-ui.umd.cjs / fzm-ui.css / *.d.ts）
pnpm build:ui
# 发布
npm publish --access public`

/** 10 套主题列表 */
const themes = [
  { id: 'transparent', name: '曜蓝·通透', desc: '默认（极透底）' },
  { id: 'clear', name: '曜蓝·清澈', desc: '高对比实底' },
  { id: 'green', name: '青空', desc: 'SaaS / 监控' },
  { id: 'amber', name: '琥珀', desc: '能源 / 工业' },
  { id: 'violet', name: '星云', desc: 'AI / 数据' },
  { id: 'crimson', name: '熔岩', desc: '告警 / 安全' },
  { id: 'rose', name: '蔷薇', desc: '消费 / 运营' },
  { id: 'indigo', name: '靛海', desc: '金融 / 中台' },
  { id: 'light-cyan', name: '冰白·曜蓝', desc: '浅色主题' },
  { id: 'light-emerald', name: '冰白·翡翠', desc: '浅色主题' },
]

/** 导出的 API 清单 */
const apiExports = [
  { name: 'useUiTheme / setUiStyle / initUiStyle', type: 'composable / 函数', desc: '主题切换 + localStorage 持久化' },
  { name: 'useChartPalette / chartPalette', type: 'composable / computed', desc: '读取 --chart-* 喂给 ECharts' },
  { name: 'withAlpha(color, α)', type: '工具函数', desc: '颜色转 rgba()，供 canvas 渐变使用' },
  { name: 'buildLineChart / buildBarChart / buildPieChart', type: '图表预设工厂', desc: '一行生成机甲风完整 EChartsOption' },
  { name: 'UI_STYLE_OPTIONS', type: '常量', desc: '10 套主题元信息（id/名称/主色/描述）' },
  { name: 'FzmUI', type: 'Vue 插件', desc: 'app.use(FzmUI) 全量注册全部组件' },
]
</script>

<template>
  <div class="intro">
    <!-- 标题 -->
    <header class="intro__header">
      <h1 class="intro__title">@fzm-tech-hud/ui 组件库</h1>
      <p class="intro__subtitle">曜蓝机甲 Tech HUD —— Vue 3 科技风 UI 组件库</p>
      <p class="intro__tagline">
        面向 <strong>大屏数字孪生 / 工业监控 / 智慧中台</strong>，纯 CSS 变量驱动，零运行时依赖，含 10 套主题预设与机甲风图表。
      </p>
    </header>

    <!-- 特性 -->
    <section class="intro__features">
      <div class="intro__feature">
        <span class="intro__feature-icon">⚡</span>
        <h3>零运行时依赖</h3>
        <p>纯 CSS 变量驱动，组件库本身不引第三方，发布体积小。</p>
      </div>
      <div class="intro__feature">
        <span class="intro__feature-icon">🎨</span>
        <h3>10 套主题</h3>
        <p>8 深色 + 2 白色，<code>&lt;html data-ui-style&gt;</code> 一键换肤，图表配色联动。</p>
      </div>
      <div class="intro__feature">
        <span class="intro__feature-icon">📐</span>
        <h3>TS + 双注册</h3>
        <p>完整类型；支持全量 <code>app.use</code> 或按需 <code>import</code>。</p>
      </div>
      <div class="intro__feature">
        <span class="intro__feature-icon">📊</span>
        <h3>机甲风图表</h3>
        <p>封装 ECharts，一行生成带辉光、菱形点、流光轨道的完整图表。</p>
      </div>
    </section>

    <!-- 快速预览 -->
    <h2 class="intro__section-title">快速预览</h2>
    <p class="intro__lead">以下是组件库的典型用法，点击右侧目录可查看每个组件的完整文档。</p>
    <div class="intro__preview">
      <TechCard title="设备概览" style="max-width: 360px">
        <div style="display: flex; gap: 0; margin-bottom: 10px">
          <KpiItem :value="186" label="在线设备" type="success" />
          <KpiItem :value="12" label="告警数" type="warning" />
        </div>
        <div style="display: flex; gap: 14px; padding: 4px 0">
          <StatusDot type="running" label="运行" />
          <StatusDot type="error" label="故障" />
          <StatusDot type="offline" label="离线" />
        </div>
        <template #footer>
          <HudButton type="primary">查看详情</HudButton>
        </template>
      </TechCard>
    </div>

    <!-- 安装 -->
    <h2 class="intro__section-title">安装</h2>
    <DemoBlock :source="installCode" />

    <!-- 使用 -->
    <h2 class="intro__section-title">使用</h2>
    <h3 class="intro__h3">全量注册</h3>
    <DemoBlock :source="globalRegisterCode" />
    <p class="intro__note">
      全量注册后，每个组件同时注册了带 <code>Fzm</code> 前缀的别名（如 <code>FzmTechCard</code>），可与业务组件共存，避免命名冲突。
    </p>

    <h3 class="intro__h3">按需引入</h3>
    <DemoBlock :source="onDemandCode" />

    <!-- 主题切换 -->
    <h2 class="intro__section-title">主题切换</h2>
    <DemoBlock :source="themeCode" />
    <p class="intro__lead">10 套主题（8 深色 + 2 白色）：</p>
    <div class="intro__themes">
      <div v-for="t in themes" :key="t.id" class="intro__theme">
        <code>{{ t.id }}</code>
        <span class="intro__theme-name">{{ t.name }}</span>
        <span class="intro__theme-desc">{{ t.desc }}</span>
      </div>
    </div>
    <p class="intro__note">
      可在本页右上角下拉实时切换主题，所有组件与图表配色联动。
      完整的主题配置（换肤原理、10 套预设详情、图表联动、自定义主题、CSS 变量清单）见
      <RouterLink to="/theme" class="intro__link">主题系统专题文档 →</RouterLink>
    </p>

    <!-- 图表 -->
    <h2 class="intro__section-title">ECharts 图表</h2>
    <p class="intro__lead">
      推荐用<strong>机甲风预设</strong>，一行生成带辉光 / 菱形数据点 / 流光轨道 / 中心 KPI 的完整图表，配色随主题联动。
      ECharts 为<strong>可选 peerDependency</strong>，使用前需自行安装。
    </p>
    <DemoBlock :source="chartCode" />
    <p class="intro__lead">涉及渐变 / 透明度时，用 <code>withAlpha()</code> 把颜色转成 <code>rgba()</code>（canvas 无法解析 CSS 变量字符串）：</p>
    <DemoBlock :source="withAlphaCode" />

    <!-- 导出 API -->
    <h2 class="intro__section-title">导出的 API</h2>
    <p class="intro__lead">除组件外，<code>@fzm-tech-hud/ui</code> 还从包根导出以下工具与预设：</p>
    <table class="intro__api">
      <thead>
        <tr><th>导出</th><th>类型</th><th>说明</th></tr>
      </thead>
      <tbody>
        <tr v-for="a in apiExports" :key="a.name">
          <td><code>{{ a.name }}</code></td>
          <td>{{ a.type }}</td>
          <td>{{ a.desc }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 发布 -->
    <h2 class="intro__section-title">发布到 npm</h2>
    <DemoBlock :source="publishCode" />
  </div>
</template>

<style scoped>
.intro {
  max-width: 960px;
  margin: 0 auto;
  padding: 8px 0 60px;
}

/* —— 标题 —— */
.intro__header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgb(var(--primary-rgb) / 0.2);
}

.intro__title {
  margin: 0 0 8px;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: var(--text-primary);
  text-shadow: 0 0 18px rgb(var(--primary-rgb) / 0.5);
}

.intro__subtitle {
  margin: 0 0 14px;
  font-size: 14px;
  color: var(--accent-light);
  letter-spacing: 1px;
}

.intro__tagline {
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
}

/* —— 特性卡片 —— */
.intro__features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 36px;
}

.intro__feature {
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.intro__feature-icon {
  font-size: 20px;
}

.intro__feature h3 {
  margin: 8px 0 6px;
  font-size: 13px;
  font-weight: 800;
  color: var(--text-primary);
}

.intro__feature p {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* —— 区块标题 —— */
.intro__section-title {
  margin: 36px 0 14px;
  padding-bottom: 8px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--text-primary);
  border-bottom: 1px solid rgb(var(--primary-rgb) / 0.25);
}

.intro__h3 {
  margin: 20px 0 10px;
  font-size: 14px;
  font-weight: 700;
  color: var(--accent-light);
}

.intro__lead {
  margin: 0 0 14px;
  font-size: 13px;
  line-height: 1.75;
  color: var(--text-secondary);
}

.intro__note {
  margin: 12px 0 0;
  padding: 10px 14px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-secondary);
  background: rgb(var(--primary-rgb) / 0.08);
  border-left: 3px solid var(--primary);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.intro__preview {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}

/* —— 主题列表 —— */
.intro__themes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px;
  margin-bottom: 8px;
}

.intro__theme {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
}

.intro__theme-name {
  font-weight: 600;
  color: var(--text-primary);
}

.intro__theme-desc {
  margin-left: auto;
  font-size: 10.5px;
  color: var(--text-muted);
  opacity: 0.7;
}

/* —— API 表 —— */
.intro__api {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}

.intro__api th {
  padding: 8px 12px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-secondary);
  background: rgb(var(--primary-rgb) / 0.08);
  border-bottom: 1px solid var(--border-color);
}

.intro__api td {
  padding: 9px 12px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  vertical-align: top;
  line-height: 1.6;
}

.intro__api tr:last-child td {
  border-bottom: none;
}

.intro__api code,
.intro__feature code,
.intro__lead code,
.intro__note code,
.intro__tagline code {
  font-family: var(--font-mono, 'SFMono-Regular', Consolas, monospace);
  font-size: 12px;
  color: var(--accent-light);
  background: rgb(var(--primary-rgb) / 0.1);
  padding: 1px 6px;
  border-radius: 4px;
}

.intro__link {
  color: var(--accent-light);
  text-decoration: none;
  border-bottom: 1px dashed rgb(var(--accent-rgb) / 0.5);
  transition: opacity 0.18s ease;
}

.intro__link:hover {
  opacity: 0.8;
}
</style>
