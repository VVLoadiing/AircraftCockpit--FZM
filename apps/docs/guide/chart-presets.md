# 机甲风图表预设

`@fzm/ui` 内置三个图表预设工厂函数，一行调用即可返回带**辉光 / 菱形数据点 / 流光轨道 / 中心 KPI / 虚线网格**的完整 EChartsOption。所有配色取自 `useChartPalette`，切换主题自动联动。

> 推荐用预设，而不是手写 option。预设已处理好 canvas 无法解析 CSS 变量、容器尺寸守卫、辉光 shadowColor 等所有坑。

## 三个预设

| 函数 | 用途 | 视觉特征 |
|------|------|----------|
| `buildLineChart` | 折线 / 趋势 | 菱形数据点 + 白描边辉光 + 面积渐变 + dashed 网格 |
| `buildBarChart` | 柱状 / 对比 | 流光轨道(showBackground) + 顶部高亮渐变 + 圆角切角感 |
| `buildPieChart` | 饼图 / 占比 | 环形中心 KPI(mono+辉光) + 扇区辉光描边 + 花瓣大圆角(borderRadius=14) |

## buildLineChart 折线图

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { BaseChart, useChartPalette, buildLineChart } from '@fzm/ui'
import '@fzm/ui/styles'
import type { EChartsOption } from 'echarts'

const { palette } = useChartPalette()

const option = computed<EChartsOption>(
  () =>
    buildLineChart({
      palette: palette.value,
      categories: ['周一', '周二', '周三', '周四', '周五'],
      series: [
        { name: '产线A', data: [320, 432, 501, 634, 790] },
        { name: '产线B', data: [220, 282, 391, 434, 590] },
      ],
      unit: '件', // tooltip 自动带单位
    }) as EChartsOption,
)
</script>

<template>
  <BaseChart :option="option" height="240px" />
</template>
```

### buildLineChart 参数

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `palette` | `ChartPalette` | — | 来自 `useChartPalette()` 的色板（必填） |
| `categories` | `(string\|number)[]` | — | 类目轴数据（必填） |
| `series` | `{ name, data }[]` | — | 系列数据（必填），颜色自动轮转 |
| `smooth` | `boolean` | `false` | 是否平滑（HUD 默认锐利折线） |
| `area` | `boolean` | `true` | 是否显示面积渐变 |
| `unit` | `string` | — | y 轴 / tooltip 数值单位 |

## buildBarChart 柱状图

```ts
const option = computed<EChartsOption>(
  () =>
    buildBarChart({
      palette: palette.value,
      categories: ['一', '二', '三', '四', '五', '六', '日'],
      series: [{ data: [120, 200, 150, 80, 70, 110, 130] }],
      unit: '件',
    }) as EChartsOption,
)
```

### buildBarChart 参数

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `palette` | `ChartPalette` | — | 色板（必填） |
| `categories` | `(string\|number)[]` | — | 类目轴数据（必填） |
| `series` | `{ name?, data }[]` | — | 系列数据（必填） |
| `color` | `string` | `palette.primary` | 柱子颜色 |
| `barWidth` | `string` | `'45%'` | 柱宽占比 |
| `unit` | `string` | — | 数值单位 |
| `horizontal` | `boolean` | `false` | 是否横向条形图 |

## buildPieChart 饼图 / 环形图

```ts
const option = computed<EChartsOption>(
  () =>
    buildPieChart({
      palette: palette.value,
      centerLabel: '设备总数',
      centerUnit: '台', // 中心自动显示总数 1694 台
      data: [
        { name: '正常', value: 1048, color: palette.value.success },
        { name: '告警', value: 335, color: palette.value.warning },
        { name: '故障', value: 124, color: palette.value.danger },
        { name: '离线', value: 187, color: '#64748b' },
      ],
    }) as EChartsOption,
)
```

### buildPieChart 参数

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `palette` | `ChartPalette` | — | 色板（必填） |
| `data` | `{ name, value, color? }[]` | — | 数据项（必填），color 不传则轮转 |
| `doughnut` | `boolean` | `true` | 是否环形（false 为实心饼） |
| `centerLabel` | `string` | `''` | 中心 KPI 标题（如「设备总数」） |
| `centerValue` | `number\|string` | 自动求和 | 中心数值（不传则自动求和） |
| `centerUnit` | `string` | `''` | 中心数值单位 |
| `radius` | `[string, string]` | `['46%','68%']` | 环形内/外半径 |

::: tip 中心 KPI 数值辉光
环形中心的总数使用 `monospace` 字体 + 主题色 `textShadowBlur` 辉光，与大屏 KPI 风格一致。hover 扇区时该扇区放大并显示「名称 + 百分比」外部标签。
:::

::: tip 扇区圆角（花瓣感）
`buildPieChart` 的扇区 `borderRadius` 固定为 `14`（花瓣 / 胶囊大圆角），这是机甲风图表的视觉特征之一，暂未开放为参数。如需调整，对返回的 option 二次加工：

```ts
const option = buildPieChart({ ... }) as EChartsOption
option.series[0].itemStyle.borderRadius = 6 // 改为小圆角
```
:::

## 主题联动

三个预设的**所有颜色**都取自 `palette.value`（依赖 `uiStyle` 的 computed），切换主题后整张图配色自动重算：

```ts
// 切主题，折线/柱状/饼图的辉光、渐变、网格色全部跟着变
setStyle('violet')
```

## 自定义扩展

预设返回的是普通 option 对象，可以再二次加工：

```ts
const option = computed(() => {
  const base = buildLineChart({ palette: palette.value, categories, series }) as EChartsOption
  // 加 markLine 均值线
  base.series[0].markLine = { data: [{ type: 'average' }] }
  return base
})
```

涉及透明度/渐变时，务必用 `withAlpha()` 把颜色转成 `rgba()`（canvas 无法解析 CSS 变量字符串）：

```ts
import { withAlpha } from '@fzm/ui'
withAlpha(palette.value.primary, 0.2) // 'rgba(111,178,201,0.2)'
```
