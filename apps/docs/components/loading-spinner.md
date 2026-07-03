# LoadingSpinner 加载中

> 机甲风双环旋转（外环顺时针、内环逆时针）+ 主题色辉光 + 可选文字。
> 对应文档：新增组件

## 基础用法

```vue
<script setup lang="ts">
import { LoadingSpinner } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <LoadingSpinner />
  <LoadingSpinner text="加载中" />
  <LoadingSpinner :size="40" text="同步数据" />
</template>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `size` | `number` | `28` | 尺寸（px） |
| `text` | `string` | `''` | 描述文字（传值后布局变为纵向） |

::: tip 卡片内加载遮罩
配合条件渲染，可在数据加载时用 LoadingSpinner 替代图表/列表内容。颜色取主题色，自动随主题联动。
:::
