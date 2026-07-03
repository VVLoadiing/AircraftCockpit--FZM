# BaseChart 图表封装

> ECharts 自适应封装，配合主题色板实现图表配色联动。
> 对应文档：第 10.5 节

封装了 init / setOption / ResizeObserver / dispose，配合 `.fzm-chart-fill` 工具类实现容器自适应。

::: warning 需要安装 echarts
`echarts` 是 `@fzm/ui` 的**可选 peerDependency**。使用 `BaseChart` 前需自行安装：

```bash
pnpm add echarts
```

组件内部用动态 `import('echarts')` 引入，未安装时会在控制台明确报错。
:::

## 基础用法

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { BaseChart, useChartPalette, chartTooltip } from '@fzm/ui'
import '@fzm/ui/styles'
import type { EChartsOption } from 'echarts'

const { palette } = useChartPalette()

const option = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  tooltip: { ...chartTooltip.value },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三'],
    axisLine: { lineStyle: { color: palette.value.axis } },
    axisLabel: { color: palette.value.label, fontSize: 9 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: palette.value.split } },
  },
  series: [{
    type: 'line',
    data: [120, 200, 150],
    lineStyle: { color: palette.value.primary, width: 3 },
    itemStyle: { color: palette.value.primary },
  }],
}))
</script>

<template>
  <BaseChart :option="option" height="240px" />
</template>
```

## 填满父容器

需要图表 100% 填满父卡片时，外层包 `.fzm-chart-fill`：

```vue
<TechCard title="实时趋势">
  <div class="fzm-chart-fill">
    <BaseChart :option="lineOption" />
  </div>
</TechCard>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `option` | `EChartsOption` | — | ECharts 配置（必填） |
| `width` | `string` | `'100%'` | 宽度 |
| `height` | `string` | `'200px'` | 高度 |
| `notMerge` | `boolean` | `true` | option 变化时是否整体替换（notMerge） |

::: tip 配色规范
图表 option 中**所有颜色**都应来自 `palette.value`，不要写死颜色，否则切换主题时图表配色不变。详见 [ECharts 图表适配](../guide/charts)。

涉及**透明度/渐变**（`areaStyle`、`colorStops` 等）时，canvas 的 `addColorStop` 无法解析 `rgb(var(--xxx-rgb) / α)` 这类 CSS 变量字符串。请用 `withAlpha()` 把实际颜色转成 `rgba()`：

```ts
import { useChartPalette, withAlpha } from '@fzm/ui'
const { palette } = useChartPalette()

// ✅ 正确
areaStyle: { color: withAlpha(palette.value.primary, 0.18) } // 'rgba(111,178,201,0.18)'
// ❌ 错误：canvas 无法解析
areaStyle: { color: 'rgb(var(--primary-rgb) / 0.18)' }
```
:::

::: warning 容器尺寸
ECharts 初始化要求容器有**非零宽高**，否则会报 `Can't get DOM width or height`。`BaseChart` 已内置 `waitForSize` 等待逻辑与 `safeResize` 尺寸守卫，会自动处理 onMounted 时容器尚未布局、隐藏 tab、窗口缩放等场景。

但前提是**容器本身最终能获得尺寸**：
- 最简单：直接给 `BaseChart` 传固定 `height`（如 `height="180px"`）
- 若要 100% 撑满父容器：父容器必须有确定高度（如 `flex: 1; min-height: 0` 的 flex 子项），并外层包 `.fzm-chart-fill`。避免父级高度也塌缩为 0 的链式 `100%`。
:::
