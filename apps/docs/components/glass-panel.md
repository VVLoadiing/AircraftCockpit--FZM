# GlassPanel 切角玻璃浮层

> 八边形切角玻璃浮层，用于 3D 场景之上的叠加浮层（如顶部 KPI 带）。
> 对应文档：第 7.3 节

视觉特征：四角八边形 `clip-path` 切角 + 16px 背景模糊（毛玻璃）+ 顶部扫光高光线。

## 基础用法

```vue
<script setup lang="ts">
import { GlassPanel } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <GlassPanel style="padding: 14px">
    <p>浮层内容</p>
  </GlassPanel>
</template>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `tag` | `string` | `'div'` | 自定义渲染的 HTML 标签 |

## Slots

| 名称 | 说明 |
|------|------|
| `default` | 浮层内容 |

::: tip
`GlassPanel` 自身不带内边距，按需通过 style/class 调整 padding。
:::
