# TechTag 科技标签

> 切角标签，语义色变体，可选关闭按钮。
> 对应文档：新增组件

## 基础用法

```vue
<script setup lang="ts">
import { TechTag } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <TechTag>默认</TechTag>
  <TechTag type="success">运行中</TechTag>
  <TechTag type="warning">预警</TechTag>
  <TechTag type="danger">故障</TechTag>
</template>
```

## 可关闭

```vue
<script setup lang="ts">
import { ref } from 'vue'
const tags = ref(['产线A', 'A区', '高温'])
</script>

<template>
  <TechTag v-for="(t, i) in tags" :key="t" closable @close="tags.splice(i, 1)">
    {{ t }}
  </TechTag>
</template>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | `'' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `''` | 着色（语义色变体） |
| `closable` | `boolean` | `false` | 是否可关闭 |

## Slots

| 名称 | 说明 |
|------|------|
| `default` | 标签内容 |

## Events

| 名称 | 说明 |
|------|------|
| `close` | 点击关闭按钮时触发 |
