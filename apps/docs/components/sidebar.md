# Sidebar 侧栏

> 透明浮层侧栏，卡片直接浮于场景之上。
> 对应文档：第 8.3 节

直接子元素会获得**错峰 fadeIn 入场动画**（最多 8 个，超出不再错峰但仍有动画）。

## 基础用法

```vue
<script setup lang="ts">
import { Sidebar, TechCard } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <Sidebar>
    <TechCard title="设备概览">
      内容 A
    </TechCard>
    <TechCard title="告警列表">
      内容 B
    </TechCard>
    <TechCard title="实时趋势">
      内容 C
    </TechCard>
  </Sidebar>
</template>
```

## 宽度变体

```vue
<Sidebar width="narrow" />  <!-- 300px -->
<Sidebar width="normal" />  <!-- 320px（默认） -->
<Sidebar width="wide" />    <!-- 340px -->
<Sidebar custom-width="360px" /> <!-- 自定义 -->
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `width` | `'normal' \| 'narrow' \| 'wide'` | `'normal'` | 宽度变体 |
| `customWidth` | `string` | — | 自定义宽度（覆盖 width 变体，需带单位，如 `'360px'`） |

## Slots

| 名称 | 说明 |
|------|------|
| `default` | 侧栏内容（建议放 `TechCard` 等卡片） |

::: warning 错峰动画作用点
错峰入场动画只作用于 `Sidebar` 的**直接子元素**。若用额外 `<div>` 包裹子卡片，动画作用点会偏移，请把卡片作为直接子节点。
:::
