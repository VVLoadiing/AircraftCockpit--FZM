# TechAvatar 头像

> 切角容器 + 图片/文字 fallback + 可选状态点。用户头像、设备图标、工位标识。
> 对应文档：新增组件

## 基础用法

```vue
<script setup lang="ts">
import { TechAvatar } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <!-- 图片 -->
  <TechAvatar src="/user.png" text="张工" :size="40" />
  <!-- 文字（无 src 时显示，中文取首字、英文取前两字母大写） -->
  <TechAvatar text="设备A" :size="40" />
  <TechAvatar text="Zhang" :size="40" shape="circle" />
</template>
```

## 带状态点

右下角叠加状态点（与 StatusDot 同色系），适合表示在线/故障：

```vue
<TechAvatar text="设备A" :size="40" status="running" />     <!-- 运行（绿脉冲点） -->
<TechAvatar text="仓W2" :size="40" status="error" />        <!-- 故障（红点） -->
<TechAvatar text="Zhang" :size="40" status="offline" />     <!-- 离线（灰点） -->
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` | `string` | `''` | 图片地址（无效或未传时显示文字） |
| `text` | `string` | `''` | 文字（取首字/前两字母） |
| `size` | `number` | `36` | 尺寸（px） |
| `shape` | `'square' \| 'circle'` | `'square'` | 形状（square 为切角） |
| `status` | `'' \| 'running' \| 'standby' \| 'stopped' \| 'error' \| 'maintenance' \| 'offline'` | `''` | 状态点 |

::: tip 文字 fallback 规则
无 `src` 或图片加载失败时显示文字：中文取首个字符，英文取前两个字符并大写。这样既能容纳设备名（如「仓W2」），也适合人名（如「ZH」）。
:::
