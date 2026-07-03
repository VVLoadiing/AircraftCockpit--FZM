# TechEmpty 空状态

> 机甲风六边形图标（漂浮动画）+ 描述文字 + 可选操作插槽。列表/图表无数据时占位。
> 对应文档：新增组件

## 基础用法

```vue
<script setup lang="ts">
import { TechEmpty, HudButton } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <TechEmpty description="暂无告警">
    <HudButton type="primary">刷新</HudButton>
  </TechEmpty>
</template>
```

## 不同图标

```vue
<TechEmpty icon="search" description="未找到匹配设备" />
<TechEmpty icon="network" description="网络连接失败" />
<TechEmpty icon="lock" description="无权限访问" />
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `description` | `string` | `'暂无数据'` | 描述文字 |
| `icon` | `'default' \| 'search' \| 'network' \| 'lock'` | `'default'` | 图标样式 |

## Slots

| 名称 | 说明 |
|------|------|
| `default` | 操作区（如刷新按钮） |
