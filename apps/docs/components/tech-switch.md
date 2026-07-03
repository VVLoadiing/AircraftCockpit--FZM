# TechSwitch 开关

> 切角轨道 + 滑块，开启时主题色渐变 + 辉光。
> 对应文档：新增组件

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TechSwitch } from '@fzm/ui'
import '@fzm/ui/styles'

const checked = ref(true)
</script>

<template>
  <TechSwitch v-model="checked" />
</template>
```

## 尺寸

```vue
<TechSwitch v-model="a" />          <!-- 默认 -->
<TechSwitch v-model="b" size="small" /> <!-- 小尺寸 -->
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `boolean` | `false` | v-model 绑定值 |
| `disabled` | `boolean` | `false` | 禁用 |
| `size` | `'normal' \| 'small'` | `'normal'` | 尺寸 |

## Events

| 名称 | 参数 | 说明 |
|------|------|------|
| `update:modelValue` | `(value: boolean)` | v-model 同步 |
| `change` | `(value: boolean)` | 切换时触发 |
