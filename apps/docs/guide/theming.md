# 主题系统

`@fzm/ui` 内置 **10 套主题**（8 深色 + 2 白色），覆盖大屏数字孪生、能源、AI、安防、日间办公等不同业务场景。

## 主题清单

`@fzm/ui` 内置 **10 套主题**（8 深色 + 2 白色）。

### 深色主题

| id | 名称 | 主色 | 适用场景 |
|----|------|------|----------|
| `transparent` | 曜蓝·通透 | `#6fb2c9` | 默认 · 极透卡片底 |
| `clear` | 曜蓝·清晰 | `#4ea8c8` | 高对比实底 · 数据密集 |
| `green` | 青空 | `#22d3ee` | 现代 SaaS · Linear 风 |
| `amber` | 翠林 | `#34d399` | 能源 / 可持续 / ESG |
| `violet` | 星云 | `#a78bfa` | AI / 智慧中台 |
| `crimson` | 晨曦 | `#fb923c` | 设备监控 / 产线 / 能耗 |
| `rose` | 玫境 | `#fb7185` | 品牌 / 安防 / 应急 |
| `indigo` | 星钻 | `#818cf8` | 高端未来感 |

### 白色主题（浅色反转）

白色主题把底色、卡片、玻璃浮窗、文字、阴影全部反转为浅色，文字对比度均达 WCAG AA，适合日间/办公/打印等场景。

| id | 名称 | 主色 | 适用场景 |
|----|------|------|----------|
| `light-cyan` | 冰白·曜蓝 | `#0891b2` | 白底 · 科技蓝青主色 |
| `light-emerald` | 冰白·翡翠 | `#059669` | 白底 · 深翠绿主色 |

::: tip 白色主题的反转项
切到白色主题时，以下体系会自动反转，无需额外配置：
- 底色：纯黑 → 浅灰白（`#eef3f7` / `#eef5f1`）
- 卡片/玻璃浮窗：深色半透 → 白色半透
- 文字：白色 → 深色（主层 `#1a2b3a`，对比度达 AA）
- 阴影：深投影 → 浅投影（避免白底发脏）
- 图表：轴线/标签变深色，配色保持鲜艳

自定义白色主题时，建议同样反转这套体系，并注意主色在白底上的对比度（建议 ≥ 3.7）。
:::

## 切换原理

1. **CSS 端**：`:root[data-ui-style='xxx']` 覆盖变量（`themes.css`）
2. **JS 端**：改 `<html data-ui-style>` 属性即触发整套换肤
3. **持久化**：`localStorage` 保存选择，刷新后保持
4. **图表联动**：通过 `useChartPalette` 的 computed 依赖 `uiStyle` 自动重算

## 使用 `useUiTheme`

```ts
import { useUiTheme } from '@fzm/ui'

const { style, setStyle, options, current, init } = useUiTheme()

// 当前主题（响应式 ref）
console.log(style.value) // 'green'

// 切换主题（自动写 localStorage + 同步 <html data-ui-style>）
setStyle('violet')

// 全部主题选项（含名称、主色、描述，可直接渲染主题切换器）
options.forEach((o) => console.log(o.id, o.name, o.color))
```

### 跟随系统深浅色（可选）

若希望白天用白色主题、夜间用深色主题，可监听系统偏好：

```ts
import { setUiStyle } from '@fzm/ui'

const mq = window.matchMedia('(prefers-color-scheme: light)')
// 系统切到浅色用「冰白·曜蓝」，否则用深色默认主题
const apply = () => setUiStyle(mq.matches ? 'light-cyan' : 'transparent')
apply()
mq.addEventListener('change', apply)
```

::: tip
跟随系统会覆盖用户的主动选择。若要「用户选过就用用户的，否则跟随系统」，可在 `apply` 里先判断 `localStorage` 是否已有值。
:::

### 在 App 启动时初始化

为避免刷新闪烁，建议在入口调用 `initUiStyle()` 把已存风格同步到 DOM：

```ts
// main.ts
import { initUiStyle } from '@fzm/ui'
import '@fzm/ui/styles'
initUiStyle() // 同步 <html data-ui-style> = localStorage 值
```

或在 `index.html` 的 `<html>` 上直接写死默认值：

```html
<html lang="zh-CN" data-ui-style="transparent">
```

## 三层联动换肤

| 层 | 切换方式 | 是否自动联动 |
|----|----------|--------------|
| 组件 CSS（`.card` 等） | `var(--xxx)` 直接读取 | ✅ 自动 |
| 图标 / SVG 辉光 | CSS 选择器补偿描边光 | ✅ 自动 |
| ECharts canvas | `getComputedStyle` 读 `--chart-*` | ⚠️ 需 `useChartPalette` 重算 |

## 自定义新主题

新增主题只需在全局 CSS 中追加一段覆盖，规则：

1. 选一个主色，按 HSL 生成 5 级色阶（dark / base / light / lighter）
2. **底色用主色的极暗同色相**（如蓝色用 `rgba(8,22,30)`），保证整体调和
3. 语义色 success/warning/danger 建议沿用中性固定值，避免每套都重新调
4. 图表 `--chart-*` 按底色亮度推导（深底需提高 axis/split 透明度）
5. `--text-muted` 在极透底上保持 `#fff`

```css
:root[data-ui-style='mybrand'] {
  /* 主色族 */
  --primary: #ff6a00;
  --primary-rgb: 255, 106, 0;
  --primary-dark: #b34a00;
  --primary-light: #ff9248;
  --primary-lighter: #ffb88a;
  --accent: #e85c00;
  --accent-rgb: 232, 92, 0;

  /* 底色（主色极暗同色相） */
  --bg-body: #0c0600;
  --bg-card: linear-gradient(168deg, rgba(36, 18, 4, 0.86), rgba(36, 18, 4, 0.96));

  /* 文字次色 */
  --text-secondary: #f2d8c0;

  /* 图表色（canvas 无法读 var，单独定义） */
  --chart-axis: rgba(252, 216, 184, 0.55);
  --chart-label: #ffffff;
  --chart-legend: #f4dcc0;
  --chart-split: rgba(252, 216, 184, 0.18);
}
```

然后扩展 `UiStyle` 类型与 `UI_STYLE_OPTIONS`，让 `useUiTheme` 识别新 id。

## 极透底可读性补偿（已内置）

深色极透背景上的 SVG 线稿图标会发飘看不清。库已在 `.fz-glass / .glass-panel / .card` 内的 svg 上统一加了 `drop-shadow` 描边光补偿，并把 `stroke="currentColor"` 的默认图标整体提亮，无需手动处理。
