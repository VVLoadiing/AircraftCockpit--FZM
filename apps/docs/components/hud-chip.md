# HudChip HUD 提示标签

> 小型 HUD 提示标签，小切角 + 半透底。
> 对应文档：第 7.8 节

## 基础用法

```vue
<script setup lang="ts">
import { HudChip } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <HudChip>DEFAULT</HudChip>
  <HudChip type="success">SUCCESS</HudChip>
  <HudChip type="warning">WARNING</HudChip>
  <HudChip type="danger">DANGER</HudChip>
</template>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | `'' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `''` | 着色（语义色变体） |

## Slots

| 名称 | 说明 |
|------|------|
| `default` | 标签内容 |
