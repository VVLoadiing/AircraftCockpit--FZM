# ECharts 图表适配

## 问题

ECharts 画在 `<canvas>` 上，**无法直接读取 CSS 变量**。如果不做适配，切换主题时图表配色不会变化。

## 解决方案

`@fzm/ui` 提供 `useChartPalette`：通过 `getComputedStyle` 把 `--chart-*` 变量转成 JS 对象，再注入 option。它依赖 `uiStyle`，切换主题后自动重算。

## 1. 定义图表专用变量（已在 tokens.css 内置）

```css
:root {
  --chart-primary: var(--primary);
  --chart-axis: rgba(190, 230, 255, 0.55);
  --chart-label: #ffffff;
  --chart-legend: #d6e8f7;
  --chart-split: rgba(190, 230, 255, 0.18);
  --chart-tooltip-bg: rgba(0, 8, 18, 0.82);
  --chart-tooltip-border: rgb(var(--primary-rgb) / 0.40);
  --chart-tooltip-text: #eef6ff;
  /* 多系列配色（高饱和鲜艳版，各主题不同） */
  --chart-series: #22d3ee, #34d399, #fbbf24, #f87171, #38bdf8, #a3e635, #fb923c, #e879f9;
}
```

> 每套主题都会同步覆盖这些 `--chart-*`，否则切主题后图表配色不变。`themes.css` 已为全部 10 套主题覆盖（白色主题的 axis/label 会反转为深色）。上方 `--chart-series` 仅为默认主题示例，其余 9 套各有自己的鲜艳色板。

## 2. 使用 `useChartPalette`

```ts
import { useChartPalette } from '@fzm/ui'

const { palette, tooltip } = useChartPalette()

// palette.value 随主题切换自动更新
palette.value.primary
palette.value.axis
palette.value.split
palette.value.tooltip // { bg, border, text }
palette.value.series // string[]
```

## 3. 图表业务层使用规范

1. **背景透明**：`backgroundColor: 'transparent'`（融入极透卡片）
2. **配色全部来自 `chartPalette`**，不写死颜色
3. **Tooltip 统一配置**：深色底 + 主题色边框 + blur 圆角
4. **用渐变 areaStyle** 增强层次
5. **渐变 / 透明度必须用 `withAlpha()`** 转 rgba：canvas 的 `addColorStop` 无法解析 `rgb(var(--xxx-rgb) / α)` 这类 CSS 变量字符串

::: tip 推荐用预设，别手写 option
折线 / 柱状 / 饼图建议直接用 `buildLineChart` / `buildBarChart` / `buildPieChart` 预设——一行生成带辉光、菱形数据点、流光轨道、中心 KPI 的完整机甲风图表，`withAlpha`、tooltip、网格都已处理好。详见 [机甲风图表预设](./chart-presets)。

下方「折线图示例」展示的是**底层手写方式**，适合需要完全自定义 option 的场景。
:::

### 折线图示例（底层手写）

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { BaseChart, useChartPalette, chartTooltip } from '@fzm/ui'
import type { EChartsOption } from 'echarts'

const { palette } = useChartPalette()

const option = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  grid: { top: 22, right: 8, bottom: 4, left: 4, containLabel: true },
  tooltip: { ...chartTooltip.value },
  legend: { textStyle: { color: palette.value.legend, fontSize: 9 } },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五'],
    axisLine: { lineStyle: { color: palette.value.axis } },
    axisLabel: { color: palette.value.label, fontSize: 9 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: palette.value.split } },
    axisLine: { show: false },
    axisLabel: { color: palette.value.label, fontSize: 9 },
  },
  series: [
    {
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      data: [120, 200, 150, 80, 70],
      lineStyle: { color: palette.value.primary, width: 3 },
      itemStyle: {
        color: palette.value.primary,
        borderColor: '#fff',
        borderWidth: 1.5,
      },
      areaStyle: { opacity: 0.18 },
    },
  ],
}))
</script>

<template>
  <BaseChart :option="option" height="240px" />
</template>
```

## 4. BaseChart 渲染壳

`BaseChart` 封装了 init / setOption / ResizeObserver / dispose，配合 `.fzm-chart-fill` 工具类实现容器自适应。

```vue
<TechCard title="实时趋势">
  <!-- 让图表 100% 填满卡片 -->
  <div class="fzm-chart-fill">
    <BaseChart :option="lineOption" />
  </div>
</TechCard>
```

> **注意**：`echarts` 是 `@fzm/ui` 的**可选 peerDependency**。使用 `BaseChart` 前需自行安装：`pnpm add echarts`。`BaseChart` 内部用动态 `import('echarts')` 引入，未安装时会在控制台明确报错。
