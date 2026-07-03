# KpiItem KPI 大数字

> 大屏顶部关键指标展示，等宽数字字体 + 主题色辉光。
> 对应文档：第 7.6 节

多个 `KpiItem` 横向排列时会自动出现分隔竖线。

## 基础用法

```vue
<script setup lang="ts">
import { KpiItem } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <div style="display: flex">
    <KpiItem :value="186" label="在线设备" type="success" />
    <KpiItem :value="12" label="告警数" type="warning" />
    <KpiItem :value="94.6" unit="%" label="OEE" type="info" />
    <KpiItem :value="1284" label="今日产量" />
  </div>
</template>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string \| number` | — | 数值（必填） |
| `label` | `string` | — | 标签（必填） |
| `type` | `'' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `''` | 数值着色（语义色变体） |
| `unit` | `string` | `''` | 数值单位（后缀） |

::: tip
数值统一使用 `--font-mono` 等宽字体，保证多位数字对齐。语义色变体会同步切换数值的辉光颜色。
:::
