# FAQ

## 切换主题后，组件变了但图表配色没变？

ECharts 画在 canvas 上，无法直接读 CSS 变量。必须通过 `useChartPalette` 读取 `--chart-*`，且图表 option 要引用 `palette.value`（一个依赖 `uiStyle` 的 computed）。详见 [ECharts 图表适配](./charts)。

## 手写图表 option 太繁琐 / 想要机甲风样式？

直接用预设：`buildLineChart` / `buildBarChart` / `buildPieChart` 一行生成带辉光、菱形数据点、流光轨道、中心 KPI 的完整图表，tooltip、网格、`withAlpha` 都已处理好，配色随主题联动。详见 [机甲风图表预设](./chart-presets)。仅当需要预设未覆盖的特殊配置（如 markLine、自定义 series 类型）时才手写 option。

## 一定要引入 Tailwind 吗？

不需要。本组件库**零运行时依赖**，样式纯 CSS 变量驱动。Tailwind v4 在设计文档中标注为「可选」，仅用于业务层布局便利，组件库本身不依赖它。

## 全量注册后组件名冲突怎么办？

全量注册时每个组件同时注册了带 `Fzm` 前缀的别名（如 `FzmTechCard`），可与业务组件共存；或改用按需引入 `import { TechCard } from '@fzm/ui'`。

## BaseChart 报错 "Cannot find module 'echarts'"？

`echarts` 是**可选 peerDependency**，使用 `BaseChart` 前需自行安装：

```bash
pnpm add echarts
```

## 极透背景上文字 / 图标看不清？

- 文字：组件已对 KPI 数值、标题等加了 `text-shadow` 辉光补偿
- SVG 图标：库已在 `.fz-glass / .glass-panel / .card` 内的 svg 上统一加了 `drop-shadow` 描边光，并把 `stroke="currentColor"` 的图标提亮

如自定义内容仍发飘，可手动加：`text-shadow: 0 1px 2px rgba(0,0,0,.85)`。

## 如何调整切角大小？

切角尺寸由 `--notch` 变量控制（默认 `12px`）。改这一个变量，所有 `.card` / `.glass-panel` 的切角统一变化：

```css
:root { --notch: 8px; } /* 更小切角 */
```

## 侧栏卡片没有错峰入场动画？

`Sidebar` 只对**直接子元素**（`:deep(*:nth-child(n))`）施加错峰 `fadeIn`。如果子元素被额外包裹（如套了一层 `<div>`），动画作用点会偏移。请把卡片作为 `Sidebar` 的直接子节点。

## 支持 SSR 吗？

支持。主题相关代码（`useUiTheme` / `useChartPalette`）均做了 `typeof document/localStorage` 判断，SSR 下安全降级。

## 如何只引入样式，不要组件？

可以。样式入口独立：

```ts
import '@fzm/ui/styles'
```

适合「只要令牌与基础视觉、组件自己写」的场景。所有视觉值都是 CSS 变量，可直接 `var(--xxx)` 消费。
