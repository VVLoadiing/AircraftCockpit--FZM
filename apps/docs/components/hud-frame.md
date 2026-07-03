# HudFrame HUD 边框

> 全屏 HUD 机甲边框（App 级外框）。
> 对应文档：第 8.1 节

大屏四缘的八边形切角边框 + 上下中央扫光线 + 四角发光角标。通常放在 App 根节点最外层，`position: fixed` 全屏覆盖、`pointer-events: none` 不影响交互。

## 基础用法

```vue
<script setup lang="ts">
import { HudFrame } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <HudFrame />
  <div class="app">
    <!-- 你的内容 -->
  </div>
</template>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `corners` | `boolean` | `true` | 是否显示四角发光角标 |
| `scanlines` | `boolean` | `true` | 是否显示上下扫光线 |

```vue
<HudFrame :scanlines="false" />
```

::: tip
`HudFrame` 自动渲染四个角标（tl/tr/bl/br），无需手动放置。`pointer-events: none` 确保不拦截点击，可放心铺在最上层。
:::
