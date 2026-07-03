# Segmented 分段控制器

> 凹槽容器 + 激活段主题色凸起 + 辉光。少量互斥选项的紧凑切换（机甲风 radio 组）。
> 对应文档：新增组件

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Segmented } from '@fzm/ui'
import '@fzm/ui/styles'

const range = ref('day')
</script>

<template>
  <Segmented
    v-model="range"
    :items="[
      { value: 'day', label: '日' },
      { value: 'week', label: '周' },
      { value: 'month', label: '月' },
    ]"
  />
</template>
```

## 撑满父容器

```vue
<Segmented v-model="range" :items="items" block />
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `string \| number` | `''` | v-model：当前激活值 |
| `items` | `{ value, label, disabled? }[]` | — | 选项（必填） |
| `disabled` | `boolean` | `false` | 禁用整组 |
| `block` | `boolean` | `false` | 是否撑满父容器宽度（各段等分） |

## Events

| 名称 | 参数 | 说明 |
|------|------|------|
| `update:modelValue` | `(value)` | v-model 同步 |
| `change` | `(value, item)` | 切换时触发 |
