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
| `options` | `{ label, value, disabled?, ...extra }[]` | — | 选项列表（必填）。支持携带任意额外字段供插槽读取 |
| `placeholder` | `string` | `'请选择'` | 占位符 |
| `disabled` | `boolean` | `false` | 禁用整个选择器 |

## 自定义选项 / 触发器（插槽）

通过 `#option` 和 `#trigger` 插槽自定义选项与触发器内容，常用于带图标、彩色圆点、副标题的选项。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TechSelect } from '@fzm/ui'

const value = ref('cyan')
const themes = [
  { label: '曜蓝·通透', value: 'cyan', color: '#6fb2c9', desc: '默认' },
  { label: '青空', value: 'green', color: '#22d3ee', desc: 'SaaS' },
  { label: '星云', value: 'violet', color: '#a78bfa', desc: 'AI' },
]
</script>

<template>
  <TechSelect v-model="value" :options="themes">
    <!-- 触发器：当前选项的彩色圆点 + 名称 -->
    <template #trigger="{ label, option }">
      <span style="display:inline-flex;align-items:center;gap:6px">
        <span class="dot" :style="{ background: option?.color }" />
        {{ label }}
      </span>
    </template>

    <!-- 选项：彩色圆点 + 名称 + 描述 -->
    <template #option="{ option }">
      <span style="display:inline-flex;align-items:center;gap:6px;width:100%">
        <span class="dot" :style="{ background: option.color }" />
        <b>{{ option.label }}</b>
        <small style="margin-left:auto;opacity:.6">{{ option.desc }}</small>
      </span>
    </template>
  </TechSelect>
</template>
```

## Slots

| 名称 | 作用域参数 | 说明 |
|------|-----------|------|
| `trigger` | `{ option, label }` | 自定义触发器显示（如带彩色圆点）。`option` 为当前选中项完整对象，`label` 为其文字 |
| `option` | `{ option }` | 自定义选项内容（如带图标/圆点/描述）。不传则默认显示 `option.label` |

## Events

| 名称 | 参数 | 说明 |
|------|------|------|
| `update:modelValue` | `(value)` | v-model 同步 |
| `change` | `(value, option)` | 选择某项时触发 |

::: tip options 支持额外字段
`options` 的每个对象除了必填的 `label` / `value`，可携带任意额外字段（如 `color`、`desc`、`icon`），这些字段可通过 `#option` / `#trigger` 插槽的 `option` 参数读取，便于自定义渲染。
:::
