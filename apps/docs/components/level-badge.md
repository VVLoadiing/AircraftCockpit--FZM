# LevelBadge 告警等级

> 告警等级徽章，红/黄/蓝切角小标。
> 对应文档：第 7.8 节

## 基础用法

```vue
<script setup lang="ts">
import { LevelBadge } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <LevelBadge level="high" text="高危" />
  <LevelBadge level="mid" text="中危" />
  <LevelBadge level="low" text="低危" />
</template>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `level` | `'high' \| 'mid' \| 'low'` | `'low'` | 等级：high(红) / mid(黄) / low(蓝) |
| `text` | `string` | `''` | 文字（默认取等级名「高/中/低」） |

## Slots

| 名称 | 说明 |
|------|------|
| `default` | 自定义文字（覆盖 `text`） |

## 等级对照

| level | 颜色 | 默认文字 |
|-------|------|----------|
| `high` | 危险红 | 高 |
| `mid` | 警告黄 | 中 |
| `low` | 主题蓝 | 低 |
