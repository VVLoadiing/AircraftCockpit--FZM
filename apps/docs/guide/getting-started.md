# 快速开始

## 环境要求

- Node.js ≥ 18
- Vue 3.4+
- pnpm（本项目为 monorepo，推荐 pnpm）

## 安装

`@fzm/ui` 以 Vue 为 peerDependency；如需图表，还需安装 echarts。

```bash
pnpm add @fzm/ui vue
# 可选：图表
pnpm add echarts
```

## 引入样式

`@fzm/ui` 的样式建议在入口（如 `main.ts`）单独引入一次：

```ts
import '@fzm/ui/styles'
```

样式包含：设计令牌（`:root` 变量）+ 10 套主题覆盖（8 深色 + 2 白色）+ 全局背景与滚动条 + 动效 keyframes + 全部组件样式。

::: tip 两种引入方式都可用
- **全量注册**（`app.use(FzmUI)`）：库入口已内置 `import './styles/index.css'`，样式会随之打包，可不单独引入。
- **按需引入**（`import { TechCard }`）：此时不会触发入口的样式打包，**务必**单独 `import '@fzm/ui/styles'`，否则组件没有样式。

为统一起见，文档示例统一写 `import '@fzm/ui/styles'`。
:::

## 两种注册方式

### 方式一：全量注册

```ts
// main.ts
import { createApp } from 'vue'
import FzmUI from '@fzm/ui'
import '@fzm/ui/styles'
import App from './App.vue'

const app = createApp(App)
app.use(FzmUI) // 全量注册所有组件
app.mount('#app')
```

全量注册时，每个组件同时注册了带 `Fzm` 前缀的别名（如 `FzmTechCard`），可与业务组件共存，避免命名冲突。

### 方式二：按需引入（推荐，Tree-shaking 友好）

```vue
<script setup lang="ts">
import { TechCard, KpiItem, StatusDot } from '@fzm/ui'
import '@fzm/ui/styles' // 仍需引入一次样式
</script>

<template>
  <TechCard title="设备概览">
    <KpiItem :value="1280" label="在线设备" type="success" />
    <StatusDot type="running" label="运行" />
  </TechCard>
</template>
```

## 最小示例

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

## 颜色与切角如何工作

所有视觉值都是 CSS 变量（定义于 `tokens.css`）。组件用 `var(--xxx)` 消费这些变量；颜色用 `rgb(var(--xxx-rgb) / α)` 三元组形式，便于运行时拼透明度。

```css
:root {
  --primary: #6fb2c9;
  --primary-rgb: 111, 178, 201; /* 用于 rgb(.../α) 拼色 */
  --notch: 12px;                /* 切角尺寸（核心视觉参数） */
}
```

切主题只需在 `<html>` 上切换 `data-ui-style` 属性，变量即整套覆盖，无需改组件代码。详见 [主题系统](./theming)。

## 下一步

- [主题系统](./theming) —— 10 套主题与自定义
- [ECharts 图表适配](./charts) —— 让图表配色联动主题
- [组件总览](/components/tech-card) —— 逐个组件的 API 与示例
