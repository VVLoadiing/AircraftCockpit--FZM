# HudButton HUD 按钮

> 切角 HUD 操作按钮，深蓝底 + 内辉光。
> 对应文档：第 7.8 节

## 基础用法

```vue
<script setup lang="ts">
import { HudButton } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <HudButton>默认</HudButton>
  <HudButton type="primary">主操作</HudButton>
  <HudButton type="success">成功</HudButton>
  <HudButton type="warning">警告</HudButton>
  <HudButton type="danger">危险</HudButton>
  <HudButton disabled>禁用</HudButton>
</template>
```

## 带图标

```vue
<HudButton>
  <template #icon>
    <svg width="12" height="12"><!-- ... --></svg>
  </template>
  导出
</HudButton>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | 按钮类型 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `nativeType` | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 type 属性 |

## Slots

| 名称 | 说明 |
|------|------|
| `icon` | 图标（前置） |
| `default` | 按钮文字 |

## 类型对照

| type | 视觉 |
|------|------|
| `default` | 深蓝半透底 + 主题色边框 |
| `primary` | 主题色实底 |
| `success` / `warning` / `danger` | 对应语义色边框与 hover 辉光 |
