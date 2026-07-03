# MetricBox Mini 统计方块

> 小型统计方块，适合在卡片内做网格化的指标展示。
> 对应文档：第 7.8 节

视觉特征：切角 + 顶部 2px 扫光线 + hover 主题色辉光。

## 基础用法

```vue
<script setup lang="ts">
import { MetricBox } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
    <MetricBox :value="1284" unit="件" label="今日产量" type="success" />
    <MetricBox :value="3.2" unit="kWh" label="能耗" type="warning" />
    <MetricBox :value="98.2" unit="%" label="良品率" />
  </div>
</template>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string \| number` | — | 数值（必填） |
| `label` | `string` | — | 标签（必填） |
| `unit` | `string` | `''` | 单位（后缀） |
| `type` | `'' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `''` | 着色（语义色变体） |
