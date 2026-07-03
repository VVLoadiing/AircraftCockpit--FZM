# CountUp 数字滚动动画

> KPI 数值从当前值平滑过渡到目标值（requestAnimationFrame + easeOutQuart）。mono 字体 + 主题色辉光。
> 对应文档：新增组件

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CountUp } from '@fzm/ui'
import '@fzm/ui/styles'

const value = ref(1284)
</script>

<template>
  <CountUp :value="value" suffix="件" type="success" />
  <button @click="value = 2000">改为 2000</button>
</template>
```

`value` 变化时自动从当前显示值滚动到新值。

## 小数与千分位

```vue
<CountUp :value="94.6" :decimals="1" suffix="%" />      <!-- 94.6 -->
<CountUp :value="1234567" :thousand="true" />            <!-- 1,234,567 -->
<CountUp :value="100" :thousand="false" prefix="¥" />    <!-- ¥100 -->
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `number` | — | 目标数值（必填） |
| `startValue` | `number` | `0` | 首次起始值 |
| `duration` | `number` | `1200` | 动画时长（ms） |
| `decimals` | `number` | `0` | 小数位数 |
| `thousand` | `boolean` | `true` | 是否千分位分隔 |
| `prefix` | `string` | `''` | 前缀 |
| `suffix` | `string` | `''` | 后缀/单位 |
| `type` | `'' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `''` | 着色 |
| `fontSize` | `string` | `'22px'` | 字号 |

::: tip 与 KpiItem 的区别
`KpiItem` 是带标签的静态 KPI 卡片；`CountUp` 是纯数字滚动组件（无标签），适合需要动画过渡的场景，可自由组合进任意布局。
:::
