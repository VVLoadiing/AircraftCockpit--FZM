# ProgressBar 进度条

> 切角进度条，主题色渐变填充 + 流光 shimmer 效果。
> 对应文档：第 7.8 节

## 基础用法

```vue
<script setup lang="ts">
import { ProgressBar } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <ProgressBar :value="42" type="info" show-text />
  <ProgressBar :value="68" type="success" show-text />
  <ProgressBar :value="85" type="warning" show-text />
  <ProgressBar :value="100" :shimmer="false" />
</template>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `number` | — | 进度值（必填） |
| `max` | `number` | `100` | 最大值 |
| `type` | `'' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `''` | 填充着色 |
| `shimmer` | `boolean` | `true` | 是否显示流光 |
| `showText` | `boolean` | `false` | 是否显示百分比文字 |

::: tip
`value` 会自动 clamp 到 `0-max` 范围，无需手动限制。填充宽度变化带 0.4s 过渡动画。
:::
