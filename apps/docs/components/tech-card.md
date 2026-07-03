# TechCard 科技面板

> 切角科技面板，整套设计系统最核心的容器。
> 对应文档：第 7.1 / 7.2 节

视觉特征：八边形 `clip-path` 切角（左上 + 右下各切一刀）+ 顶部扫光横线 + 左切角斜边高亮线 + 左侧纵向发光光柱。

## 基础用法

```vue
<script setup lang="ts">
import { TechCard } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <TechCard title="设备概览">
    <p>内容区</p>
  </TechCard>
</template>
```

## 关闭 hover 辉光

```vue
<TechCard title="静态展示" :hoverable="false">
  内容
</TechCard>
```

## 自定义标题（插槽）

`title` 既支持 `prop`，也支持具名插槽，用于标题里嵌入图标、徽章等：

```vue
<TechCard>
  <template #title>
    设备概览 <CountBadge :value="12" type="warning" />
  </template>
  内容
</TechCard>
```

## 底部插槽

```vue
<TechCard title="告警">
  内容区
  <template #footer>
    <HudButton type="primary">查看全部</HudButton>
  </template>
</TechCard>
```

## 限制内容区高度（超出滚动）

通过 `min-height` / `max-height` 限制**内容区**高度，内容超出时纵向滚动。标题条与底栏固定不动，仅内容区滚动——适合告警列表、日志、长表格等场景。

```vue
<TechCard title="告警列表" max-height="240px">
  <TechRow v-for="a in alerts" :key="a.id">
    {{ a.text }}
  </TechRow>
</TechCard>
```

```vue
<!-- 最小高度：内容不足时撑开到 120px -->
<TechCard title="概览" min-height="120px">…</TechCard>

<!-- 同时限定区间：120px ~ 300px，超出滚动 -->
<TechCard title="日志" min-height="120px" max-height="300px">…</TechCard>
```

::: tip 滚动作用于内容区
`min-height` / `max-height` 作用于 `.fzm-card__body`（内容区），而非整个卡片。这样标题条（横幅条）和底栏（footer）始终可见，只有中间内容滚动。设为 `'none'` 可取消高度限制。
:::

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | `''` | 卡片标题（科技横幅条）。不传则不渲染标题条 |
| `hoverable` | `boolean` | `true` | 是否开启悬停辉光（边框增强 + 主题色外辉光） |
| `minHeight` | `string` | `''` | 内容区最小高度（如 `'120px'`）。内容不足时撑开到该高度 |
| `maxHeight` | `string` | `''` | 内容区最大高度（如 `'300px'`）。超出则纵向滚动；`'none'` 表示不限 |

## Slots

| 名称 | 说明 |
|------|------|
| `title` | 标题内容（覆盖 `title` prop） |
| `default` | 主体内容区（默认 flex 列向） |
| `footer` | 底部区域（如操作按钮） |

::: tip Tailwind v4 用户注意
不要在本组件根上额外加 `display`（如 `grid/flex`），无 layer 的规则会盖过模板里的 utility。需要列向 flex 时已在组件内部处理，外层布局请包裹容器。
:::
