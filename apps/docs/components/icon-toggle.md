# IconToggle 图标按钮组

> 一组图标/文字按钮，单选模式，激活项主题色凸起 + 辉光。适合视图模式切换、工具栏。
> 对应文档：新增组件

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { IconToggle } from '@fzm/ui'
import '@fzm/ui/styles'

const mode = ref('card')
</script>

<template>
  <IconToggle
    v-model="mode"
    :items="[
      { value: 'card', label: '卡片', icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
      { value: 'list', label: '列表', icon: 'M4 6h16M4 12h16M4 18h16' },
    ]"
  />
</template>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `string \| number` | `''` | v-model：当前激活项 value |
| `items` | `{ value, label?, icon?, disabled? }[]` | — | 选项列表（必填） |
| `disabled` | `boolean` | `false` | 禁用整组 |

## Events

| 名称 | 参数 | 说明 |
|------|------|------|
| `update:modelValue` | `(value)` | v-model 同步 |
| `change` | `(value, item)` | 切换时触发 |

::: tip icon 用法
`icon` 是 SVG `<path d="...">` 字符串。组件用 `v-html` 注入到 `<path>` 中。`label` 可选，与图标共存（图标在左、文字在右）。纯文字按钮可不传 `icon`。
:::
