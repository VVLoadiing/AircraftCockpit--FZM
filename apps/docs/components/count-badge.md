# CountBadge 计数徽章

> 数字 / 计数徽章，切角 + 主题色边框。
> 对应文档：第 7.8 节

## 基础用法

```vue
<script setup lang="ts">
import { CountBadge } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <CountBadge :value="99" />
  <CountBadge :value="12" type="warning" />
  <CountBadge :value="3" type="danger" />
  <CountBadge value="OK" type="success" />
</template>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string \| number` | — | 数值或文字（必填） |
| `type` | `'' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `''` | 着色（语义色变体） |
