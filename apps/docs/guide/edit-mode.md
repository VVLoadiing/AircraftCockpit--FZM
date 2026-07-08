# 编辑模式（Playground）

「编辑模式」是 Playground 演示页内置的**可视化大屏搭建器**：在左右双侧栏里自由增删 `TechCard` 模块、为每张卡片选择内容样式、调整宽高，所见即所得地拼装一个数字孪生大屏，结果自动保存到本地。

::: tip 这是 Playground 功能，不是组件库 API
编辑模式属于 `apps/playground` 演示项目，不在 `@fzm/ui` 组件库中。它演示的是「如何用本库的组件搭出一个可编辑的大屏」，本身可作二次开发的参考骨架。
:::

## 如何进入

启动 Playground 后，顶部导航第 2 个 tab 即「编辑模式」：

```bash
pnpm dev   # 打开 http://localhost:5173，切换到「编辑模式」tab
```

进入后默认就是**编辑态**：左右两侧栏的每张卡片标题栏右侧会显示操作按钮，底部有「添加 TechCard」入口。顶部工具栏可随时切换到「预览态」纯查看效果。

## 编辑操作

进入编辑态后，每张卡片标题栏右侧提供 4 个图标按钮：

| 按钮 | 作用 |
|------|------|
| ↑ / ↓ | 上下移动卡片顺序（首位禁用 ↑、末位禁用 ↓） |
| ⚙ | 打开**设置弹窗**：集中编辑标题、内容类型、宽度、高度 |
| ✕ | 删除该卡片 |

其余交互：

- **添加卡片**：点侧栏底部「+ 添加 TechCard」→ 展开面板选内容类型 + 填标题（可空）→「确认添加」，卡片追加到该侧末尾。
- **改标题**：双击标题文字进入内联编辑，`Enter` 保存、`Esc` 取消；空标题自动回退原标题。
- **完成编辑**：顶部工具栏「完成编辑」按钮切到预览态，隐藏所有控件，纯展示当前布局。
- **恢复默认**：仅编辑态可见，一键清空本地保存并恢复初始布局。

## 内容类型

每张卡片可选 9 种内置内容样式，按三大类组织：

| 类别 | 类型 | 说明 |
|------|------|------|
| 图表 | 折线图 | `buildLineChart` + `BaseChart`，带辉光线 / 菱形点 / 面积渐变 |
| 图表 | 柱状图 | `buildBarChart` + `BaseChart`，流光轨道 + 顶部高光 |
| 图表 | 饼图 | `buildPieChart` + `BaseChart`，环形 + 中心 KPI |
| 数值 / KPI | KpiItem | KPI 大数字行（在线 / 效率 / 告警 / 故障） |
| 数值 / KPI | CountUp | 数字滚动动画（产量 / 良品率 / 能耗） |
| 数值 / KPI | MetricBox | Mini 统计方块网格 |
| 列表 / 行 | DataRow | 数据键值行（延迟 / 设备 / 产量 / 效率） |
| 列表 / 行 | TechRow | 科技列表项（告警条目 + 等级徽章） |
| 列表 / 行 | ProgressBar | 进度条组（CPU / 内存 / 磁盘 / 带宽） |

::: tip 内容是预置 mock 数据
卡片内的具体数值是用于展示样式的占位数据，真正持久化的是**布局结构**（哪些卡片、什么类型、什么宽高、什么顺序）。如需让卡片内容也可编辑（如改图表数据），可在此基础上扩展属性面板。
:::

## 宽高规则

设置弹窗的「宽度 / 高度」字段遵循以下规则：

| 字段 | 输入 | 行为 |
|------|------|------|
| 宽度 | `320px` / `50%` 等 | 卡片按指定宽度显示 |
| 宽度 | 留空 | 跟随侧栏宽度（默认） |
| 高度 | `200px` 等 | 卡片按指定高度显示，并退出侧栏均分 |
| **高度** | **留空** | **fill 模式 —— 在侧栏 flex 列里均分高度（默认）** |

- 宽高输入支持 `px` / `%` / `em` / `rem` / `vw` / `vh`；**纯数字会自动补 `px`**（输入 `200` → 存为 `200px`）。
- 图表卡片最小高度约 `90px`（ECharts canvas 下限），低于此值不再缩小以保证可读性。

## 持久化

编辑结果会**自动保存**到浏览器 `localStorage`（key 为 `fzm-edit-layout`），刷新页面、重启服务后仍在。无需手动保存。

- 任何改动（增删卡片、移动、改类型 / 标题 / 宽高）都会即时写入。
- 「恢复默认」会清除该 key 并回到初始布局（左右各 2~3 张示例卡片）。

::: warning localStorage 限制
持久化仅作用于当前浏览器。换设备 / 清浏览器数据会丢失。它是演示用的本地存储，非真正的后端方案。
:::

## 实现说明（供二次开发参考）

编辑模式完全限定在 `apps/playground` 内，**未改动 `packages/ui`**（库保持纯净）。涉及文件：

| 文件 | 职责 |
|------|------|
| `src/composables/useEditLayout.ts` | 布局状态（左右两栏卡片列表）+ localStorage 持久化 + 增 / 删 / 移 / 改操作，模块级单例 |
| `src/views/EditModeView.vue` | 主视图：左右双 `Sidebar` + 顶部玻璃工具栏 + 添加面板 + 编辑态开关 |
| `src/components/edit/EditableCard.vue` | 包裹 `TechCard`，编辑态标题栏显示 ↑↓⚙✕ 控件；应用 width/height 内联样式 |
| `src/components/edit/CardRenderer.vue` | 按 `contentType` 渲染 9 种内容；图表用 `useChartPalette` + `computed` 包 `buildXxxChart` |
| `src/components/edit/CardSettingsPanel.vue` | 设置弹窗（`FzGlass` 壳），编辑标题 / 类型 / 宽高 |

两个关键的工程实现点：

1. **设置弹窗用 `<Teleport to="body">`**：弹窗虽是 `position: fixed`，但若渲染在 `TechCard` 内部会被其 `clip-path`（八边形切角）裁剪，无法铺满视口。Teleport 到 `<body>` 才能真正浮在最外层。
2. **fill 均分通过完整 flex 链生效**：`Sidebar`（flex 容器）→ `.editable-card`（既是 `flex:1` 的 item、又是 `display:flex` 的容器）→ `TechCard`（`flex:1 1 0`）。中间包裹层缺 `display:flex` 会导致 fill 失效、卡片只按内容高度撑开。

## 下一步

- [快速开始](./getting-started) —— 组件库的安装与注册
- [TechCard 科技面板](/components/tech-card) —— 编辑模式的核心容器组件
- [Sidebar 侧栏](/components/sidebar) —— 左右侧栏容器
- [机甲风图表预设](./chart-presets) —— 卡片内图表用的 `buildLineChart` 等
