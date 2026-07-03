# StatusDot 状态点

> 设备 / 任务状态指示点。运行状态脉冲翠绿，错误状态闪烁。
> 对应文档：第 7.7 节

## 基础用法

```vue
<script setup lang="ts">
import { StatusDot } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <StatusDot type="running" label="运行" />
  <StatusDot type="standby" label="待机" />
  <StatusDot type="error" label="故障" />
  <StatusDot type="offline" label="离线" />
</template>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | `'running' \| 'standby' \| 'stopped' \| 'error' \| 'maintenance' \| 'offline'` | `'running'` | 状态类型 |
| `label` | `string` | `''` | 状态文字（不传则仅显示圆点；传 `'auto'` 则自动取 type 对应中文：运行/待机/停止/故障/维护/离线） |

## Slots

| 名称 | 说明 |
|------|------|
| `default` | 自定义状态文字（覆盖 `label`） |

## 状态类型对照

| type | 视觉 | 动效 |
|------|------|------|
| `running` | 翠绿（success） | 脉冲 glow |
| `standby` | 主题色 | 静态发光 |
| `stopped` | 灰 | 无 |
| `error` | 红 | 闪烁 |
| `maintenance` | 警告黄 | 静态发光 |
| `offline` | 深灰 | 无 |
