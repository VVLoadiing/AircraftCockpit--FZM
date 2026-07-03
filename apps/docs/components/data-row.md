# DataRow 数据键值行

> 简洁的数据键值行，hover 变 `--bg-hover`。
> 对应文档：第 7.8 节

## 基础用法

```vue
<script setup lang="ts">
import { DataRow } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <DataRow label="设备 ID" value="FX-3200-007" />
  <DataRow label="运行时长" value="1,284h" />
  <DataRow label="负责人" value="张工" />
</template>
```

## 自定义内容（插槽）

```vue
<DataRow label="健康度">
  <ProgressBar :value="96" type="success" />
</DataRow>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | `string` | — | 键名（也可用 `#label` 插槽） |

## Slots

| 名称 | 说明 |
|------|------|
| `label` | 键名内容（覆盖 `label` prop） |
| `default` | 值内容（默认 mono 字体右对齐） |
