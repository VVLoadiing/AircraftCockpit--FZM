# TechSelect 切角下拉选择

> 切角触发器 + 机甲风玻璃浮层选项列表，支持禁用项、键盘 ESC 关闭、选中滚动定位。
> 对应文档：新增组件

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TechSelect } from '@fzm/ui'
import '@fzm/ui/styles'

const value = ref('online')
</script>

<template>
  <TechSelect
    v-model="value"
    :options="[
      { label: '全部状态', value: 'all' },
      { label: '在线', value: 'online' },
      { label: '离线', value: 'offline', disabled: true },
    ]"
    placeholder="请选择状态"
  />
</template>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `string \| number` | `''` | v-model 绑定值 |
| `options` | `{ label, value, disabled? }[]` | — | 选项列表（必填） |
| `placeholder` | `string` | `'请选择'` | 占位符 |
| `disabled` | `boolean` | `false` | 禁用整个选择器 |

## Events

| 名称 | 参数 | 说明 |
|------|------|------|
| `update:modelValue` | `(value)` | v-model 同步 |
| `change` | `(value, option)` | 选择某项时触发 |

::: tip options 数据结构
每个选项 `{ label: string; value: string|number; disabled?: boolean }`。`disabled` 的选项不可选但仍展示（灰色）。
:::
