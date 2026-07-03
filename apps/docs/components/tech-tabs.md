# TechTabs 标签页

> 科技横幅条风格标签头 + 激活指示条（主题色光柱 + 辉光）。配合面板插槽渲染内容。
> 对应文档：新增组件

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TechTabs } from '@fzm/ui'
import '@fzm/ui/styles'

const tab = ref('overview')
</script>

<template>
  <TechTabs
    v-model="tab"
    :items="[
      { value: 'overview', label: '概览' },
      { value: 'detail', label: '详情' },
      { value: 'log', label: '日志' },
    ]"
  >
    <div v-if="tab === 'overview'">概览内容</div>
    <div v-else-if="tab === 'detail'">详情内容</div>
    <div v-else>日志内容</div>
  </TechTabs>
</template>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `string \| number` | `''` | v-model：当前激活标签 value |
| `items` | `{ value, label, disabled? }[]` | — | 标签列表（必填） |

## Slots

| 名称 | 说明 |
|------|------|
| `default` | 面板内容（作用域插槽，提供 `{ item, value }`） |
| `panel-{value}` | 按标签 value 命名的面板（如 `#panel-overview`） |

## Events

| 名称 | 参数 | 说明 |
|------|------|------|
| `update:modelValue` | `(value)` | v-model 同步 |
| `change` | `(value, item)` | 切换标签时触发 |

::: tip 面板渲染
默认插槽提供作用域参数 `{ item, value }`，方便条件渲染。也可用 `#panel-{value}` 具名插槽按标签分发不同面板。
:::
