# TechInput 科技输入框

> 切角科技风输入框，聚焦时主题色辉光，支持前缀/后缀插槽与清空。
> 对应文档：新增组件

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TechInput } from '@fzm/ui'
import '@fzm/ui/styles'

const value = ref('')
</script>

<template>
  <TechInput v-model="value" placeholder="请输入设备编号" />
</template>
```

## 前缀/后缀插槽 + 可清空

```vue
<TechInput v-model="kw" placeholder="搜索设备" clearable>
  <template #prefix>
    <svg width="12" height="12"><!-- 搜索图标 --></svg>
  </template>
  <template #suffix>台</template>
</TechInput>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `string \| number` | `''` | v-model 绑定值 |
| `placeholder` | `string` | `''` | 占位符 |
| `type` | `string` | `'text'` | 原生 input type |
| `disabled` | `boolean` | `false` | 禁用 |
| `readonly` | `boolean` | `false` | 只读 |
| `clearable` | `boolean` | `false` | 是否可清空 |

## Slots

| 名称 | 说明 |
|------|------|
| `prefix` | 前置内容（图标、单位） |
| `suffix` | 后置内容 |

## Events

| 名称 | 参数 | 说明 |
|------|------|------|
| `update:modelValue` | `(value: string)` | v-model 同步 |
| `input` | `(value: string)` | 输入时触发 |
| `change` | `(value: string)` | 失焦/回车时触发 |
| `clear` | — | 点击清空按钮时触发 |
