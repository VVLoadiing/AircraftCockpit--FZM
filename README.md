# 曜蓝机甲 Tech HUD · 项目模板

一套面向 **大屏数字孪生 / 工业监控 / 智慧中台** 的科技风 Vue 3 项目模板（深色为主，含 2 套白色主题），内置可独立发布到 npm 的 UI 组件库 `@fzm/ui`。

设计语言源自 [`UI设计系统规范.md`](./UI设计系统规范.md)，核心特征：切角科技面板、高亮辉光、毛玻璃浮层、低饱和工业配色、等宽数字字体、10 套主题预设（8 深色 + 2 白色）。

---

## 仓库结构（pnpm 单仓多包）

```
PC模板项目/
├─ packages/
│  └─ ui/            # @fzm/ui —— 可发 npm 的组件库（Vue 3 + TS + 纯 CSS 变量）
└─ apps/
   ├─ playground/    # Vite + Vue 演示页（3 视图：大屏示例/组件总览/组件演示，可互相跳转 + 10 套主题切换）
   └─ docs/          # VitePress 文档站（安装 / 主题 / 各组件 API + 示例）
```

## 环境要求

- Node.js ≥ 18
- pnpm ≥ 9（本项目使用 pnpm workspace）

```bash
# 若未安装 pnpm
npm install -g pnpm
```

## 快速开始

```bash
# 1. 安装依赖（根目录执行，自动联动所有子包）
pnpm install

# 2. 启动演示页（3 个视图：大屏组装示例 / 组件总览 / 组件演示 + 主题切换）
pnpm dev

# 3. 启动文档站
pnpm dev:docs

# 4. 构建组件库
pnpm build:ui
```

## 常用脚本

| 命令 | 作用 |
|------|------|
| `pnpm dev` | 启动 playground 演示页 |
| `pnpm dev:docs` | 启动 VitePress 文档站 |
| `pnpm build:ui` | 构建 `@fzm/ui` 组件库（产出 dist/，含类型与样式） |
| `pnpm build` | 依次构建 UI 库与演示页 |
| `pnpm build:docs` | 构建文档站 |
| `pnpm preview` | 预览演示页构建产物 |
| `pnpm clean` | 清理所有子包的 dist 与 node_modules |

## Playground 演示页（3 个视图，可互相跳转）

启动 `pnpm dev` 后，演示页包含三个视图：

1. **大屏组装示例** — 完整数字孪生大屏（3D 场景全屏铺底 + 双侧栏浮层 + KPI/图表）。鼠标 hover 任意组件区域会显示「查看组件 →」提示，点击即跳转到该组件的演示页并高亮定位。
2. **组件总览** — 按 5 类（基础容器 / 数据展示 / 反馈标识 / 输入导航 / 布局）展示全部 29 个组件卡片，点击任一卡片跳转到演示页对应锚点。
3. **组件演示** — 逐个组件的可交互 demo，支持从大屏/总览页跳转过来后自动滚动定位 + 高亮闪烁。

顶部「主题」切换条可在 10 套主题（8 深色 + 2 白色）间实时切换，所有组件与图表配色联动。

## `@fzm/ui` 组件库

- **零运行时依赖**：纯 CSS 变量驱动，组件库本身不引第三方
- **Vue / ECharts 为 peerDependency**：避免重复安装、版本冲突
- **双注册模式**：支持 `app.use(FzmUI)` 全量注册，也支持 `import { TechCard } from '@fzm/ui'` 按需引入
- **10 套主题**：`<html data-ui-style="xxx">` 触发（8 深色 + 2 白色），配套 `useUiTheme()` 切换 + 持久化
- **机甲风图表预设**：`buildLineChart` / `buildBarChart` / `buildPieChart` 一行生成带辉光、菱形数据点、流光轨道、中心 KPI 的完整 EChartsOption；`withAlpha()` 处理 canvas 渐变透明度

详细使用见 [文档站](./apps/docs) 或 [packages/ui/README.md](./packages/ui/README.md)。

---

*文档版本：v1.0 · 设计语言：曜蓝机甲 Tech HUD*
