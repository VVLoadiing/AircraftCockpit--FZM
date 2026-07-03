# TechDivider 分割线

> 主题色渐变线 + 可选文字/标签（水平居中显示），也可作垂直分隔。
> 对应文档：新增组件

## 基础用法

```vue
<script setup lang="ts">
import { TechDivider } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <p>上方内容</p>
  <TechDivider />
  <p>下方内容</p>
</template>
```

## 带文字

```vue
<TechDivider>分区标题</TechDivider>
<TechDivider>共 12 条</TechDivider>
```

## 文字对齐 / 垂直

```vue
<TechDivider align="left">左对齐</TechDivider>
<TechDivider align="right">右对齐</TechDivider>

<!-- 垂直（行内） -->
<span>A</span><TechDivider direction="vertical" /><span>B</span>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 方向 |
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | 文字对齐（水平时生效） |

## Slots

| 名称 | 说明 |
|------|------|
| `default` | 分割线文字/标签（仅水平方向） |
