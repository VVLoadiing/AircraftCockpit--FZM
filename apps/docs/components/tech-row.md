# TechRow 科技列表项

> 科技风列表项，左 2px 强调边 + hover/active 加深底。
> 对应文档：第 7.8 节

适合告警列表、设备清单、消息流等场景。

## 基础用法

```vue
<script setup lang="ts">
import { TechRow, LevelBadge } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <TechRow active>激活态（左 2px 强调边 + 加深底）</TechRow>
  <TechRow>普通列表项</TechRow>
  <TechRow>悬停可见 hover 效果</TechRow>
</template>
```

## 前缀 / 后缀插槽

```vue
<TechRow>
  <template #prefix>
    <LevelBadge level="high" text="高危" />
  </template>
  3#注塑机 温度超限 92℃
  <template #suffix>
    <span>12:04:21</span>
  </template>
</TechRow>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `active` | `boolean` | `false` | 是否激活态 |

## Slots

| 名称 | 说明 |
|------|------|
| `prefix` | 左侧前置内容（如徽章、图标） |
| `default` | 主体内容（flex 撑满） |
| `suffix` | 右侧后置内容（如时间） |
