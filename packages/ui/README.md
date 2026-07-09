# @fzm-tech-hud/ui

> 曜蓝机甲 Tech HUD —— Vue 3 科技风 UI 组件库（深色为主，含 2 套白色主题）
> 面向 **大屏数字孪生 / 工业监控 / 智慧中台**，设计语言源自 `UI设计系统规范.md`。

## 特性

- **零运行时依赖**：纯 CSS 变量驱动，组件库本身不引第三方
- **Vue 3 + TypeScript**：`<script setup>` + 完整类型
- **10 套主题预设**（8 深色 + 2 白色）：`<html data-ui-style="xxx">` 一键换肤，图表配色联动
- **纯 CSS 变量 + scoped CSS**：不依赖原子类框架，发布体积小
- **ECharts 适配 + 机甲风预设**：`useChartPalette` 把 CSS 变量喂给 canvas 图表；`buildLineChart/buildBarChart/buildPieChart` 一行生成带辉光、菱形点、流光轨道、中心 KPI 的完整图表
- **双注册模式**：全量 `app.use(FzmUI)` 或按需 `import { TechCard }`

## 安装

```bash
pnpm add @fzm-tech-hud/ui
# peer 依赖
pnpm add vue
# 如需图表
pnpm add echarts
```

## 使用

### 全量注册

```ts
// main.ts
import { createApp } from 'vue'
import FzmUI from '@fzm-tech-hud/ui'
import '@fzm-tech-hud/ui/styles'  // ⚠️ 样式需单独引入
import App from './App.vue'

const app = createApp(App)
app.use(FzmUI)
app.mount('#app')
```

```vue
<template>
  <TechCard title="设备概览">
    <p>内容区</p>
  </TechCard>
</template>
```

### 按需引入

```vue
<script setup lang="ts">
import { TechCard, KpiItem, StatusDot } from '@fzm-tech-hud/ui'
import '@fzm-tech-hud/ui/styles'
</script>

<template>
  <TechCard title="关键指标">
    <KpiItem :value="1280" label="在线设备" type="success" />
    <StatusDot type="running" label="运行" />
  </TechCard>
</template>
```

> 全量注册时，每个组件同时注册了带 `Fzm` 前缀的别名（如 `FzmTechCard`），可与业务组件共存。

## 主题切换

```ts
import { useUiTheme } from '@fzm-tech-hud/ui'

const { style, setStyle, options } = useUiTheme()
// 切换主题（自动写 localStorage + 同步 <html data-ui-style>）
setStyle('green')
```

10 套主题（8 深色 + 2 白色）：`transparent`(默认) / `clear` / `green` / `amber` / `violet` / `crimson` / `rose` / `indigo` / `light-cyan`(冰白·曜蓝) / `light-emerald`(冰白·翡翠)。

## ECharts 图表

推荐用**机甲风预设**，一行生成带辉光 / 菱形数据点 / 流光轨道 / 中心 KPI 的完整图表，配色随主题联动：

```vue
<script setup lang="ts">
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
</script>

<template>
  <BaseChart :option="option" height="240px" />
</template>
```

另有 `buildBarChart`（流光轨道 + 顶部高亮渐变）、`buildPieChart`（环形中心 KPI + 花瓣大圆角）。详见 [机甲风图表预设](../apps/docs/guide/chart-presets.md)。

涉及渐变 / 透明度时，用 `withAlpha()` 把颜色转成 `rgba()`（canvas 无法解析 CSS 变量字符串）：

```ts
import { withAlpha } from '@fzm-tech-hud/ui'
withAlpha(palette.value.primary, 0.2) // 'rgba(8,145,178,0.2)'
```

> ECharts 为**可选 peerDependency**，使用 `BaseChart` / 预设前需自行安装 `echarts`。

## 组件清单（30 个）

> **计数说明**：共 30 个组件，其中 `FzGlass` 携 3 个配套子组件（`FzGlassTitle` / `FzGlassRow` / `FzGlassClose`），下表合并展示，故表行数 ≠ 30。

### 基础容器

| 组件 | 用途 | 对应文档章节 |
|------|------|--------------|
| `TechCard` | 切角科技面板 + 科技横幅条标题 | 7.1 / 7.2 |
| `GlassPanel` | 切角玻璃浮层（场景叠加） | 7.3 |
| `FzGlass` | 统一玻璃浮窗（随主题深浅反转） | 7.4 |
| `FzGlassTitle` / `FzGlassRow` / `FzGlassClose` | 浮窗配套标题/数据行/关闭按钮 | 7.5 |

### 数据展示

| 组件 | 用途 |
|------|------|
| `KpiItem` | KPI 大数字（7.6） |
| `CountUp` | 数字滚动动画 |
| `MetricBox` | Mini 统计小方块（7.8） |
| `DataRow` | 数据键值行（7.8） |
| `TechRow` | 科技列表项（7.8） |
| `TechTag` | 科技标签（可关闭） |
| `TechAvatar` | 头像 / 设备图标（带状态点） |
| `TechDivider` | 分割线（带文字） |
| `BaseChart` | ECharts 自适应封装（10.5，含尺寸守卫） |

### 反馈与标识

| 组件 | 用途 |
|------|------|
| `StatusDot` | 状态点（脉冲/闪烁，7.7） |
| `CountBadge` | 计数徽章（7.8） |
| `LevelBadge` | 告警等级徽章（7.8） |
| `ProgressBar` | 切角流光进度条（7.8） |
| `HudButton` | HUD 操作按钮（7.8） |
| `HudChip` | HUD 提示标签（7.8） |
| `TechEmpty` | 空状态占位 |
| `LoadingSpinner` | 加载中（机甲风双环） |

### 输入与导航

| 组件 | 用途 |
|------|------|
| `TechInput` | 科技风输入框（前缀/后缀/可清空） |
| `TechSelect` | 切角下拉选择 |
| `TechSwitch` | 开关 |
| `IconToggle` | 图标按钮组（视图模式切换） |
| `TechTabs` | 标签页（激活指示条） |
| `Segmented` | 分段控制器 |

### 布局

| 组件 | 用途 |
|------|------|
| `AppHeader` | 应用级机甲风头部浮条（电流母线/状态组/用户菜单·主题切换） |
| `HudFrame` | 全屏 HUD 机甲边框 + 四角角标（8.1） |
| `Sidebar` | 透明浮层侧栏（错峰入场，8.3） |

## 导出的组合式函数、工具与图表预设

除组件外，`@fzm-tech-hud/ui` 还从包根导出以下 API：

| 导出 | 类型 | 说明 |
|------|------|------|
| `useUiTheme` / `setUiStyle` / `initUiStyle` / `uiStyle` / `currentUiStyle` | composable / 函数 / ref | 主题切换 + localStorage 持久化 |
| `useChartPalette` / `chartPalette` / `chartTooltip` | composable / computed | 读取 `--chart-*` 喂给 ECharts |
| `withAlpha(color, α)` | 工具函数 | 把颜色转 rgba()，供 canvas 渐变使用 |
| `buildLineChart` / `buildBarChart` / `buildPieChart` | 图表预设工厂 | 一行生成机甲风完整 EChartsOption |
| `UI_STYLE_OPTIONS` | 常量 | 10 套主题元信息（id/名称/主色/描述） |

## 发布

```bash
pnpm build          # 产出 dist/（fzm-ui.js / fzm-ui.umd.cjs / fzm-ui.css / *.d.ts）
npm publish --access public
```
