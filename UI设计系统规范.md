# UI 设计系统规范 ·「曜蓝机甲 Tech HUD」

> 一套面向**大屏数字孪生 / 工业监控 / 智慧中台**的深色科技风设计系统。
> 本文档自包含、与具体项目解耦——可直接拷贝到任意 Web 项目复用。

---

## 目录

1. [设计理念](#1-设计理念)
2. [技术栈与架构](#2-技术栈与架构)
3. [设计令牌（Design Tokens）总表](#3-设计令牌design-tokens总表)
4. [配色系统](#4-配色系统)
5. [8 套主题预设](#5-8-套主题预设)
6. [字体与排版](#6-字体与排版)
7. [核心组件样式](#7-核心组件样式)
8. [布局与 HUD 框架](#8-布局与-hud-框架)
9. [动效规范](#9-动效规范)
10. [ECharts 图表适配](#10-echarts-图表适配)
11. [主题切换机制](#11-主题切换机制)
12. [快速接入指南](#12-快速接入指南)

---

## 1. 设计理念

整套视觉语言命名为 **「曜蓝机甲 Tech HUD」**，围绕"工业仪表 + 战术 HUD"的意象构建。

### 视觉关键词
- **深蓝青底** — 极透纯黑底，透出冷灰青辉光与科技网格
- **切角科技面板** — 多边形 `clip-path` 切角，非圆角矩形
- **高亮辉光** — 主题色发光描边 / 内光柱 / 数字辉光，营造"通电感"
- **毛玻璃浮层** — 强模糊 + 低饱和辉光阴影的黑色玻璃
- **低饱和工业配色** — 沉稳不刺眼，适合长时间大屏监控
- **等宽数字字体** — KPI 数值统一用 mono 字体保证对齐

### 五个识别特征（决定了"它看起来是不是这套风"）
1. 卡片左上角有 **切角斜边高亮线** + 顶部一道 **扫光横线**
2. 卡片左侧有 **纵向发光光柱**（机甲细节）
3. 面板标题是 **科技横幅条**（左箭标 + 渐变衬底 + 斜切尾翼）
4. 浮层右上角有 **微小角光**（机甲仪表感）
5. 大屏整体外缘有 **八边形 HUD 切角边框** + 四角发光角标

---

## 2. 技术栈与架构

| 层 | 技术 | 作用 |
|----|------|------|
| 原子层 | **CSS 自定义属性（CSS Variables）** | 所有颜色/圆角/阴影/切角用 `--*` 变量定义 |
| 主题层 | `<html data-ui-style="xxx">` | 在 `:root` 上挂属性选择器覆盖变量，整套换肤 |
| 工具层 | Tailwind CSS v4（可选） | 配合 `flex/grid/spacing` 等 utility 做布局 |
| 适配层 | `getComputedStyle` 读取变量 | 把 CSS 变量喂给 canvas 类库（ECharts 等） |
| 图表层 | ECharts 6（可选） | 透明底 + 主题色，随风格联动 |

> **关键设计：所有视觉值都是 CSS 变量。** 切主题只换变量，组件 CSS 与图表配色一起联动。
> 其中颜色用 `rgb(var(--xxx-rgb) / α)` 三元组形式，便于运行时拼透明度。

```
        ┌─────────────────────────────┐
        │  :root  →  --primary 等       │   原子层（CSS 变量）
        │  :root[data-ui-style] 覆盖    │   主题层
        └──────────────┬──────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
   组件类(.card/.fz-glass)     getComputedStyle → JS 对象
   直接 var(--xxx)             喂给 ECharts 等 canvas 库
```

---

## 3. 设计令牌（Design Tokens）总表

以下是**默认主题（通透曜蓝）**的完整 token，构成整套系统的根基。

### 3.1 布局尺寸
```css
--header-h:    78px;     /* 顶栏高度 */
--sidebar-w:   320px;    /* 侧栏宽度 */
--sidebar-gap: 10px;     /* 侧栏卡片间距 */
--sidebar-pad: 12px;     /* 侧栏内边距 */
--notch:       12px;     /* 切角尺寸（核心视觉参数） */
```

### 3.2 圆角（机甲风：极小圆角 + 切角为主）
```css
--radius-sm: 3px;
--radius-md: 4px;
--radius-lg: 6px;
--radius-xl: 8px;
--glass-radius: 14px;   /* 浮窗专用较大圆角 */
```

### 3.3 主色（冷峻低饱和工业灰青）
```css
--primary:        #6fb2c9;
--primary-rgb:    111, 178, 201;   /* 用于 rgb(.../α) 拼色 */
--primary-dark:   #4a8a9e;
--primary-light:  #8fc3d4;
--primary-lighter:#b8d8e0;
--accent:         #5fa8bd;
--accent-rgb:     95, 168, 189;
--accent-light:   #82bccc;
--primary-bg:     rgb(var(--primary-rgb) / 0.20);
--primary-border: rgb(var(--primary-rgb) / 0.42);
--primary-gradient:     linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
--primary-gradient-soft:linear-gradient(135deg, rgb(var(--primary-rgb)/.22), rgb(var(--accent-rgb)/.18));
```

### 3.4 语义色（同步低饱和）
| 语义 | 色 | rgb | 浅色 | 背景色 |
|------|----|----|------|--------|
| 成功 success | `#6fc9a8` | `111,201,168` | `#94d6bd` | `rgba(111,201,168,.20)` |
| 警告 warning | `#e0b85c` | `224,184,92` | `#ecca82` | `rgba(224,184,92,.20)` |
| 危险 danger  | `#d87878` | `216,120,120` | `#e09a9a` | `rgba(216,120,120,.22)` |
| 信息 info    | = primary | — | = primary-light | = primary-bg |

```css
--status-running-rgb: 47, 230, 167;  /* 运行状态点专用翠绿（动态脉冲） */
```

### 3.5 表面层（极透纯黑底 + 深蓝青渐变卡片）
```css
--bg-body:       #050709;             /* 极透纯黑 */
--bg-card:       linear-gradient(168deg, rgba(5,30,54,.2), rgba(5,30,54,.4) 60%, rgba(5,30,54,.45));
--bg-card-strong:rgba(4,24,44,.94);   /* 高对比实底 */
--bg-elevated:   rgba(6,30,54,.97);
--bg-scene:      #dfeaf6;             /* 3D 场景底色（浅色，供模型衬托） */
--bg-hover:      rgb(var(--primary-rgb) / 0.18);
--bg-row:        rgb(var(--primary-rgb) / 0.12);
```

### 3.6 文字
```css
--text-primary:    #fff;      /* 主文字（极透底上需提亮） */
--text-secondary:  #b8d8ea;   /* 次级文字 */
--text-muted:      #fff;      /* 弱化但保持亮（极透底补偿） */
--text-on-primary: #032030;   /* 主色背景上的文字 */
```

### 3.7 描边
```css
--border-color: rgb(var(--primary-rgb) / 0.36);
--border-light: rgb(var(--primary-rgb) / 0.22);
--border-strong:rgb(var(--primary-rgb) / 0.60);
```

### 3.8 阴影（深底投影 + 辉光双体系）
```css
/* 常规层级投影 */
--shadow-xs: 0 1px 3px rgba(0,6,10,.55);
--shadow-sm: 0 3px 10px rgba(0,6,10,.58);
--shadow-md: 0 8px 24px rgba(0,6,10,.62);
--shadow-lg: 0 16px 42px rgba(0,6,10,.66);
--shadow-xl: 0 26px 64px rgba(0,6,10,.70);

/* 卡片：深底投影 + 主题色内辉光 + 顶部高光内描边 */
--shadow-card:        0 10px 32px rgba(0,8,14,.58),
                     inset 0 0 26px rgb(var(--accent-rgb)/.12),
                     inset 0 1px 0 rgba(160,205,220,.20);
--shadow-card-hover:  0 16px 42px rgba(0,8,14,.66),
                     0 0 24px rgb(var(--primary-rgb)/.28),
                     inset 0 0 30px rgb(var(--accent-rgb)/.18);
--shadow-primary:     0 4px 16px rgb(var(--accent-rgb)/.45);

/* 状态辉光（单一颜色向外发光） */
--shadow-glow-blue:    0 0 24px rgb(var(--primary-rgb)/.30);
--shadow-glow-cyan:    0 0 24px rgb(var(--accent-rgb)/.30);
--shadow-glow-green:   0 0 24px rgb(var(--success-rgb)/.26);
--shadow-glow-warning: 0 0 24px rgb(var(--warning-rgb)/.24);
--shadow-glow-danger:  0 0 24px rgb(var(--danger-rgb)/.28);
```

### 3.9 统一黑色玻璃浮窗（FZM Glass）
所有弹窗 / 详情卡 / 标签条 / 配置面板的统一基类，保证观感一致。
```css
--glass-bg:
  radial-gradient(125% 140% at 50% 0%, rgb(var(--primary-rgb)/.12), transparent 58%),
  linear-gradient(180deg, rgba(0,0,0,.42), rgba(0,6,10,.48) 55%, rgba(0,0,0,.55));
--glass-bg-strong:    /* 更强不透明 */
  radial-gradient(125% 140% at 50% 0%, rgb(var(--primary-rgb)/.14), transparent 58%),
  linear-gradient(180deg, rgba(0,0,0,.52), rgba(0,6,10,.58) 55%, rgba(0,0,0,.66));
--glass-blur:         blur(28px) saturate(1.3);
--glass-blur-strong:  blur(32px) saturate(1.4);
--glass-border:       1px solid rgb(var(--primary-rgb)/.28);
--glass-inset:        inset 0 0 0 1px rgba(255,255,255,.10);
--glass-shadow:
  0 18px 50px rgba(0,0,0,.45),
  0 2px 10px rgba(0,0,0,.35),
  0 0 24px rgb(var(--primary-rgb)/.16),
  inset 0 1px 0 rgba(200,230,240,.18);
--glass-shadow-hover:
  0 24px 60px rgba(0,0,0,.5),
  0 4px 14px rgba(0,0,0,.4),
  0 0 32px rgb(var(--primary-rgb)/.24),
  inset 0 1px 0 rgba(200,230,240,.24);
```

---

## 4. 配色系统

### 4.1 全局背景（科技网格）
```css
background-image:
  radial-gradient(1200px 700px at 50% -15%, rgba(80,140,160,.14), transparent 65%),  /* 顶部辉光 */
  radial-gradient(1000px 600px at -10% 110%, rgb(var(--accent-rgb)/.06), transparent 65%), /* 左下辉光 */
  linear-gradient(rgb(var(--primary-rgb)/.035) 1px, transparent 1px),   /* 水平网格线 */
  linear-gradient(90deg, rgb(var(--primary-rgb)/.035) 1px, transparent 1px); /* 垂直网格线 */
background-size: auto, auto, 36px 36px, 36px 36px;   /* 网格密度 36px */
```

### 4.2 配色使用原则
- **主色**用于：标题箭标、强调数值、激活态、主按钮、进度条填充
- **语义色**用于：状态点、KPI 数值着色（success/warning/danger 变体）、告警等级
- **辉光**永远跟随语义色：`box-shadow: 0 0 24px rgb(var(--xxx-rgb)/.3)`
- **文字**主层用纯白，次层用主题色浅调（如 `#b8d8ea`）

---

## 5. 8 套主题预设

主题通过 `<html data-ui-style="id">` 触发，**只覆盖需要变化的变量**（主色 / 底色 / 文字次色 / 图表色）。每套主题适配不同业务场景：

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

### 5.1 主题覆盖模板（以「青空」为例）
```css
:root[data-ui-style='green'] {
  /* 主色族 */
  --primary: #22d3ee;       --primary-rgb: 34, 211, 238;   --primary-dark: #0e7490;
  --primary-light: #67e8f9; --primary-lighter: #a5f3fc;
  --accent: #06b6d4;        --accent-rgb: 6, 182, 212;     --accent-light: #22d3ee;

  /* 语义色（非蓝主题也建议保持统一中性，仅主色变） */
  --success: #34d399;  --success-rgb: 52, 211, 153;
  --warning: #fbbf24;  --warning-rgb: 251, 191, 36;
  --danger:  #f87171;  --danger-rgb: 248, 113, 113;
  --status-running-rgb: 52, 211, 153;

  /* 深石板底（底色与主色同色相，保持调和） */
  --bg-body: #04080a;
  --bg-card: linear-gradient(168deg, rgba(8,22,30,.86), rgba(8,22,30,.92) 60%, rgba(8,22,30,.96));
  --bg-card-strong: rgba(6,18,26,.98);
  --bg-elevated: rgba(10,24,32,.98);

  --text-secondary: #bae6f0;
  --text-muted: #fff;

  /* 图表色（canvas 无法读 var，单独定义） */
  --chart-axis: rgba(186,230,240,.55);
  --chart-label: #ffffff;
  --chart-legend: #c8edf2;
  --chart-split: rgba(186,230,240,.18);
  --chart-tooltip-bg: rgba(4,14,20,.92);
  --chart-tooltip-text: #e8f8fc;
}
```

### 5.2 自定义新主题的规则
新增主题只需：
1. 选一个主色，按 HSL 生成 5 级色阶（dark / base / light / lighter）
2. **底色用主色的极暗同色相**（如蓝色用 `rgba(8,22,30)`），保证整体调和
3. 语义色 success/warning/danger 建议沿用中性固定值，避免每套都重新调
4. 图表 `--chart-*` 按底色亮度推导（深底需提高 axis/split 透明度）
5. `--text-muted` 在极透底上保持 `#fff`，在实底上略降到中性浅色

---

## 6. 字体与排版

```css
/* 正文（系统字体栈，中文优先） */
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display',
             'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;

/* 等宽数字（KPI 数值、ID、时间） */
--font-mono: 'SF Mono', 'DIN Alternate', 'JetBrains Mono', 'Roboto Mono', 'Oswald', monospace;
```

### 字号约定
| 用途 | 字号 | 字重 | 备注 |
|------|------|------|------|
| 品牌主标题 | 较大 | 800 | 配辉光 text-shadow |
| 卡片标题 `.card-title` | 12px | 800 | `letter-spacing: 2px` |
| KPI 数值 `.kpi-value` | 22px | 800 | mono 字体 + 辉光 |
| KPI 标签 `.kpi-label` | 10px | 600 | 大写 + `letter-spacing: .8px` |
| 数据行 `.data-row` | 12px | 400 | 次级文字色 |
| HUD 按钮 `.hud-btn` | 11px | 700 | `letter-spacing: 1.5px` |
| HUD 提示 `.hud-chip` | 10px | 600 | — |
| 告警等级 `.level-badge` | 10px | 700 | `letter-spacing: 1px` |

### 文字辉光（极透底可读性补偿）
深色极透背景上的文字需配 `text-shadow` 保证边缘清晰：
```css
/* 数值（主题色辉光） */
text-shadow: 0 1px 2px rgba(0,0,0,.85), 0 0 16px rgb(var(--primary-rgb)/.55);
/* 标题 */
text-shadow: 0 1px 2px rgba(0,0,0,.8), 0 0 12px rgb(var(--primary-rgb)/.55);
/* 弱化小字 */
text-shadow: 0 1px 2px rgba(0,0,0,.75);
```

---

## 7. 核心组件样式

### 7.1 `.card` — 切角科技面板（最核心容器）

**视觉特征：** 切角 + 顶部扫光线 + 左切角斜边高亮 + 左侧纵向光柱。

```css
.card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  /* 八边形切角（左上 + 右下各切一刀） */
  clip-path: polygon(
    var(--notch) 0, 100% 0,
    100% calc(100% - var(--notch)),
    calc(100% - var(--notch)) 100%,
    0 100%, 0 var(--notch)
  );
  transition: box-shadow .25s ease, border-color .25s ease;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
/* 左上切角斜边高亮线 + 顶部扫光横线 */
.card::before {
  content: '';
  position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(135deg, rgb(var(--primary-rgb)/.85) 0,
                    rgb(var(--primary-rgb)/.85) 2px, transparent 2px)
      top left / var(--notch) var(--notch) no-repeat,
    linear-gradient(90deg, transparent, rgb(var(--primary-rgb)/.55), transparent)
      top center / 60% 1px no-repeat;
}
/* 左侧纵向发光光柱（机甲细节） */
.card::after {
  content: '';
  position: absolute; top: 10px; bottom: 10px; left: 0; width: 2px;
  background: linear-gradient(180deg,
    rgb(var(--primary-rgb)/.65),
    rgb(var(--primary-rgb)/.06) 40%,
    rgb(var(--primary-rgb)/.06) 60%,
    rgb(var(--primary-rgb)/.45));
  pointer-events: none;
}
.card:hover {
  box-shadow: var(--shadow-card-hover);
  border-color: var(--border-strong);
}
```

> **⚠️ Tailwind v4 注意：** 不要在 `.card` 上写 `display`——无 layer 的规则会盖过模板里的 `grid/flex` utility。需要列向 flex 时模板自行加 `flex flex-col`。

### 7.2 `.card-title` — 科技横幅条标题

左发光箭标 + 渐变衬底 + 斜切尾翼 + 主题色光柱。

```css
.card-title {
  position: relative;
  font-size: 12px; font-weight: 800; color: #fff;
  margin: -4px -6px 10px;
  padding: 6px 10px 6px 22px;
  display: flex; align-items: center; gap: 8px;
  letter-spacing: 2px;
  text-shadow: 0 1px 2px rgba(0,0,0,.8), 0 0 12px rgb(var(--primary-rgb)/.55);
  background: linear-gradient(90deg,
    rgb(var(--accent-rgb)/.30) 0%,
    rgb(var(--accent-rgb)/.10) 45%, transparent 85%);
  clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
  border-bottom: 1px solid rgb(var(--primary-rgb)/.35);
}
/* 左侧发光三角箭标 */
.card-title::before {
  content: '';
  position: absolute; left: 6px; top: 50%;
  transform: translateY(-50%);
  width: 0; height: 0;
  border-left: 8px solid var(--accent);
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  filter: drop-shadow(0 0 6px rgb(var(--accent-rgb)/.9));
}
/* 最左侧 3px 主题色光柱 */
.card-title::after {
  content: '';
  position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
  background: linear-gradient(180deg, var(--primary), var(--primary-dark));
  box-shadow: 0 0 10px rgb(var(--primary-rgb)/.9);
}
```

### 7.3 `.glass-panel` — 切角玻璃浮层
用于 3D 场景之上的浮层（如顶部 KPI 带），八边形切角 + 背景模糊。
```css
.glass-panel {
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card);
  backdrop-filter: blur(16px) saturate(1.2);
  box-shadow: var(--shadow-card);
  clip-path: polygon(
    var(--notch) 0, calc(100% - var(--notch)) 0, 100% var(--notch),
    100% calc(100% - var(--notch)), calc(100% - var(--notch)) 100%,
    var(--notch) 100%, 0 calc(100% - var(--notch)), 0 var(--notch));
}
.glass-panel::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(90deg, transparent 10%,
    rgb(var(--primary-rgb)/.65) 50%, transparent 90%) top center / 70% 1.5px no-repeat;
}
```

### 7.4 `.fz-glass` — 全局统一黑色玻璃浮窗基类
所有弹窗/详情卡/标签条/配置面板的统一外观，保证深黑透明 + 强模糊 + 青色辉光。
```css
.fz-glass {
  position: relative;
  background: var(--bg-card);
  border: var(--glass-border);
  border-radius: var(--glass-radius);
  color: var(--text-primary);
}
/* 顶部 1px 扫光高光 */
.fz-glass::before {
  content: ''; position: absolute; inset: 0;
  border-radius: inherit; pointer-events: none;
  background: linear-gradient(90deg, transparent 8%,
    rgb(var(--primary-rgb)/.55) 50%, transparent 92%) top center / 64% 1px no-repeat;
}
/* 右上角微小角光（机甲仪表感） */
.fz-glass::after {
  content: ''; position: absolute; top: 0; right: 0;
  width: 22px; height: 22px;
  border-top: 1px solid rgb(var(--primary-rgb)/.55);
  border-right: 1px solid rgb(var(--primary-rgb)/.55);
  border-top-right-radius: inherit; pointer-events: none;
  filter: drop-shadow(0 0 4px rgb(var(--primary-rgb)/.45));
}
.fz-glass-strong { background: var(--glass-bg-strong); }
```

### 7.5 浮窗配套小件
```css
/* 关闭按钮 */
.fz-close { width:22px; height:22px; border-radius:7px;
  color: var(--text-muted);
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.10);
  display:inline-flex; align-items:center; justify-content:center;
  cursor:pointer; transition: all .18s ease; }
.fz-close:hover { color:#fff;
  background: rgba(239,68,68,.28); border-color: rgba(239,68,68,.55); }

/* 浮窗标题条（左色条 + 发光文字） */
.fz-title { display:flex; align-items:center; gap:8px;
  font-size:12.5px; font-weight:800; letter-spacing:1px; color:#f4fcff;
  text-shadow: 0 1px 2px rgba(0,0,0,.8), 0 0 10px rgb(var(--primary-rgb)/.45); }
.fz-title::before { content:''; width:3px; height:14px; border-radius:2px;
  background: linear-gradient(180deg, var(--primary), var(--primary-dark));
  box-shadow: 0 0 8px rgb(var(--primary-rgb)/.7); }

/* 浮窗数据行 */
.fz-row { display:flex; justify-content:space-between; padding:6px 9px;
  border-radius:8px; font-size:11px;
  background: rgb(var(--primary-rgb)/.05);
  border: 1px solid rgb(var(--primary-rgb)/.10); }
.fz-row b { font-family: var(--font-mono); font-weight:700; color:#f4fcff;
  text-shadow: 0 1px 2px rgba(0,0,0,.85); }
```

### 7.6 KPI 大数字
```css
.kpi-item { text-align:center; padding:4px 12px; position:relative; }
/* KPI 之间的分隔竖线 */
.kpi-item + .kpi-item::before {
  content:''; position:absolute; left:0; top:22%; height:56%; width:1px;
  background: linear-gradient(180deg, transparent, rgb(var(--primary-rgb)/.40), transparent);
}
.kpi-value { font-size:22px; font-weight:800; font-family:var(--font-mono);
  line-height:1.2; color:#fff;
  text-shadow: 0 1px 2px rgba(0,0,0,.85), 0 0 16px rgb(var(--primary-rgb)/.55); }
.kpi-value.success { color:var(--success); /* 同步换 text-shadow 用 success-rgb */ }
.kpi-value.warning { color:var(--warning); }
.kpi-value.danger  { color:var(--danger);  }
.kpi-label { font-size:10px; font-weight:600; color:var(--text-muted);
  margin-top:3px; letter-spacing:.8px; text-transform:uppercase;
  text-shadow: 0 1px 2px rgba(0,0,0,.75); }
```

### 7.7 状态点 `.status-dot`
```css
.status-dot { width:8px; height:8px; border-radius:50%; display:inline-block; }
.status-dot.running  { background:var(--success);
  box-shadow: 0 0 0 3px rgb(var(--status-running-rgb)/.18),
              0 0 8px rgb(var(--status-running-rgb)/.65);
  animation: pulseGlow 2s ease-in-out infinite; }   /* 脉冲 */
.status-dot.standby  { background:var(--primary);
  box-shadow: 0 0 0 3px rgb(var(--primary-rgb)/.18), 0 0 6px rgb(var(--primary-rgb)/.55); }
.status-dot.stopped  { background:#94a3b8; box-shadow: 0 0 0 3px rgba(148,163,184,.16); }
.status-dot.error    { background:#ff5f5f;
  box-shadow: 0 0 0 3px rgba(255,95,95,.20), 0 0 10px rgba(255,95,95,.70);
  animation: blink 1s infinite; }                    /* 闪烁 */
.status-dot.maintenance { background:#e0b85c; /* ... */ }
.status-dot.offline  { background:#64748b; }
```

### 7.8 其他常用件
| 类名 | 用途 | 关键样式 |
|------|------|----------|
| `.metric-box` | Mini 统计小方块 | 切角 + 顶部 2px 扫光线 + hover 辉光 |
| `.data-row` | 数据键值行 | hover 变 `--bg-hover` |
| `.tech-row` | 科技列表项 | 左 2px 强调边 + hover/active 加深 |
| `.count-badge` | 计数徽章 | 切角 + 主色边框 |
| `.level-badge.high/mid/low` | 告警等级 | 红/黄/蓝切角小标 |
| `.progress-track/fill` | 进度条 | 切角轨道 + 主题色渐变填充 + 流光 shimmer |
| `.hud-btn` | HUD 操作按钮 | 切角 + 深蓝底 + 内辉光 |
| `.hud-chip` | HUD 提示标签 | 小切角 + 半透底 |

```css
/* 切角进度条（带流光） */
.progress-track { height:6px; background:rgb(var(--primary-rgb)/.18);
  border:1px solid rgb(var(--primary-rgb)/.16);
  clip-path: polygon(3px 0,100% 0,calc(100% - 3px) 100%,0 100%); overflow:hidden; }
.progress-fill { height:100%; background:var(--primary-gradient);
  box-shadow: 0 0 8px rgb(var(--primary-rgb)/.60); position:relative;
  transition: width .4s ease; }
.progress-fill::after { content:''; position:absolute; inset:0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent);
  background-size:200% 100%; animation: shimmer 2.5s linear infinite; }

/* HUD 切角按钮 */
.hud-btn { display:inline-flex; align-items:center; gap:6px;
  padding:7px 16px; font-size:11px; font-weight:700; letter-spacing:1.5px;
  color:var(--text-primary);
  background: linear-gradient(180deg, rgba(8,44,76,.90), rgba(4,26,48,.92));
  border: 1px solid rgb(var(--primary-rgb)/.45);
  clip-path: polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);
  backdrop-filter: blur(12px); cursor:pointer; transition: all .2s ease; }
.hud-btn:hover { border-color: rgb(var(--primary-rgb)/.75);
  color: var(--accent-light);
  box-shadow: 0 6px 18px rgb(var(--accent-rgb)/.30),
              inset 0 0 16px rgb(var(--accent-rgb)/.18); }
```

### 7.9 滚动条（统一深色科技风）
```css
::-webkit-scrollbar { width:5px; height:5px; }
::-webkit-scrollbar-track { background: rgba(255,255,255,.04); }
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg,
    rgb(var(--primary-rgb)/.45), rgb(var(--accent-rgb)/.45));
  border-radius:4px; }
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg,
    rgb(var(--primary-rgb)/.70), rgb(var(--accent-rgb)/.70)); }
```

---

## 8. 布局与 HUD 框架

### 8.1 全屏 HUD 机甲边框（App 级外框）
大屏四缘的八边形切角边框 + 上下中央扫光线 + 四角发光角标。
```css
.hud-frame {
  position: fixed; inset: 6px; z-index: 60; pointer-events: none;
  border: 1px solid rgb(var(--primary-rgb)/.22);
  clip-path: polygon(
    18px 0, calc(100% - 18px) 0, 100% 18px,
    100% calc(100% - 18px), calc(100% - 18px) 100%,
    18px 100%, 0 calc(100% - 18px), 0 18px);
}
.hud-frame::before, .hud-frame::after {
  content:''; position:absolute; width:130px; height:2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  box-shadow: 0 0 12px rgb(var(--accent-rgb)/.8);
}
.hud-frame::before { top:-1px; left:50%; transform:translateX(-50%); }
.hud-frame::after  { bottom:-1px; left:50%; transform:translateX(-50%); }

/* 四角发光角标 */
.hud-corner { position:absolute; width:26px; height:26px;
  border:2px solid rgb(var(--primary-rgb)/.85);
  filter: drop-shadow(0 0 8px rgb(var(--primary-rgb)/.6)); }
.hud-corner.tl { top:0; left:0; border-right:none; border-bottom:none; }
.hud-corner.tr { top:0; right:0; border-left:none; border-bottom:none; }
.hud-corner.bl { bottom:0; left:0; border-right:none; border-top:none; }
.hud-corner.br { bottom:0; right:0; border-left:none; border-top:none; }
```

### 8.2 典型大屏布局（场景铺底 + 浮层叠加）
数字孪生大屏的标准布局：3D 场景全屏铺底，UI 以浮层形式叠加。

```
┌──────────────────────────────────────────────┐
│ ╔══ HUD Frame（全屏切角边框）════════════════╗ │
│ ║   [AppHeader 顶部浮动毛玻璃浮条]            ║ │
│ ║ ┌──────┐                       ┌──────┐   ║ │
│ ║ │sidebar│   3D Scene 全屏铺底    │sidebar│  ║ │
│ ║ │ card │   (浮层叠加其上)         │ card │  ║ │
│ ║ │ card │                          │ card │  ║ │
│ ║ └──────┘                       └──────┘   ║ │
│ ║          [BottomNav 底部浮动导航]          ║ │
│ ╚══════════════════════════════════════════╝ │
└──────────────────────────────────────────────┘
```

### 8.3 侧栏 `.sidebar`
透明浮层侧栏，卡片直接浮于场景之上。
```css
.sidebar {
  width: var(--sidebar-w); flex-shrink: 0;
  padding: var(--sidebar-pad);
  overflow: hidden;
  display: flex; flex-direction: column;
  gap: var(--sidebar-gap);
  background: var(--bg-sidebar); /* 透明 */
  position: relative;
}
.sidebar-narrow { width: 300px; }
.sidebar-wide   { width: 340px; }

/* 侧栏卡片错峰入场动画 */
.sidebar > .card { animation: fadeIn .45s ease both; }
.sidebar > .card:nth-child(2) { animation-delay: .06s; }
.sidebar > .card:nth-child(3) { animation-delay: .12s; }
.sidebar > .card:nth-child(4) { animation-delay: .18s; }
```

### 8.4 图表填充容器
图表需要 100% 填满父卡片时使用（flex 撑满 + 让 ECharts 自适应）。
```css
.chart-fill { flex: 1 1 0; min-height: 0; width: 100%;
  position: relative; overflow: hidden; }
.chart-fill > div { width: 100% !important; height: 100% !important; }
```

---

## 9. 动效规范

| 名称 | 用途 | 时长 | 关键帧 |
|------|------|------|--------|
| `fadeIn` | 卡片入场 | 0.45s | translateY(6px)→0 + opacity |
| `pulseGlow` | 运行状态点脉冲 | 2s loop | box-shadow 辉光强弱 |
| `blink` | 错误状态闪烁 | 1s loop | opacity 1→0.25 |
| `shimmer` | 进度条流光 | 2.5s linear loop | background-position |
| `scanline` | 扫描线 | — | translateX(-100%→100%) |
| `scrollUp` | 告警列表滚动 | 25s linear loop | translateY(0→-50%) |

```css
@keyframes fadeIn    { from {opacity:0; transform:translateY(6px);} to {opacity:1; transform:translateY(0);} }
@keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 3px rgb(var(--status-running-rgb)/.18),0 0 6px rgb(var(--status-running-rgb)/.50);}
                       50%   {box-shadow:0 0 0 3px rgb(var(--status-running-rgb)/.30),0 0 12px rgb(var(--status-running-rgb)/.85);} }
@keyframes blink     { 0%,100%{opacity:1;} 50%{opacity:.25;} }
@keyframes shimmer   { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }

/* 页面切换过渡 */
.page-enter-active, .page-leave-active { transition: opacity .28s ease, transform .28s ease; }
.page-enter-from { opacity:0; transform:translateY(8px); }
.page-leave-to   { opacity:0; transform:translateY(-4px); }
```

---

## 10. ECharts 图表适配

### 10.1 问题
ECharts 画在 `<canvas>` 上，**无法直接读取 CSS 变量**。需要通过 `getComputedStyle` 把 `--chart-*` 变量转成 JS 对象，再注入 option。

### 10.2 CSS 端：定义图表专用变量
```css
:root {
  --chart-primary: var(--primary);
  --chart-success: var(--success);
  --chart-warning: var(--warning);
  --chart-danger:  var(--danger);
  --chart-axis:    rgba(190,230,255,.55);   /* 坐标轴线 */
  --chart-label:   #ffffff;                 /* 轴标签 */
  --chart-legend:  #d6e8f7;                 /* 图例文字 */
  --chart-split:   rgba(190,230,255,.18);   /* 分割线 */
  --chart-tooltip-bg:     rgba(0,8,18,.82);
  --chart-tooltip-border: rgb(var(--primary-rgb)/.40);
  --chart-tooltip-text:   #eef6ff;
}
```
> 每套主题都要同步覆盖这些 `--chart-*`，否则切主题后图表配色不变。

### 10.3 JS 端：`chartPalette` 读取层
```ts
import { ref, computed } from 'vue'

export type UiStyle = 'transparent' | 'clear' | 'green' | 'amber' | 'violet' | 'crimson' | 'rose' | 'indigo'

const STORAGE_KEY = 'uiStyle'
export const uiStyle = ref<UiStyle>(
  (localStorage.getItem(STORAGE_KEY) as UiStyle) || 'clear')

export function setUiStyle(style: UiStyle) {
  if (style === uiStyle.value) return
  uiStyle.value = style
  localStorage.setItem(STORAGE_KEY, style)
  document.documentElement.setAttribute('data-ui-style', style)
}

function cssVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

export const chartPalette = computed(() => {
  void uiStyle.value            // 依赖风格，切换后失效重算
  return {
    primary: cssVar('--chart-primary', '#6fb2c9'),
    success: cssVar('--chart-success', '#6fc9a8'),
    warning: cssVar('--chart-warning', '#e0b85c'),
    danger:  cssVar('--chart-danger',  '#d87878'),
    axis:    cssVar('--chart-axis',    'rgba(190,230,255,.55)'),
    label:   cssVar('--chart-label',   '#ffffff'),
    legend:  cssVar('--chart-legend',  '#d6e8f7'),
    split:   cssVar('--chart-split',   'rgba(190,230,255,.18)'),
    tooltip: {
      bg:     cssVar('--chart-tooltip-bg',     'rgba(0,8,18,.82)'),
      border: cssVar('--chart-tooltip-border', 'rgba(111,178,201,.40)'),
      text:   cssVar('--chart-tooltip-text',   '#eef6ff'),
    },
  }
})

// 模块加载即恢复已存风格
document.documentElement.setAttribute('data-ui-style', uiStyle.value)
```

### 10.4 图表业务层使用规范
1. **背景透明** `backgroundColor: 'transparent'`（融入极透卡片）
2. **配色全部来自 `chartPalette`**，不写死颜色
3. **Tooltip 统一配置**：深色底 + 主题色边框 + blur 圆角
4. **用渐变 areaStyle** 增强层次（顶部主题色 → 底部透明）

```ts
// 通用 Tooltip
const tip = computed(() => ({
  trigger: 'axis',
  backgroundColor: chartPalette.value.tooltip.bg,
  borderColor: chartPalette.value.tooltip.border,
  textStyle: { color: chartPalette.value.tooltip.text, fontSize: 11 },
  extraCssText: 'box-shadow:0 8px 24px rgba(0,0,0,.55);border-radius:10px;backdrop-filter:blur(12px);',
  confine: true,
}))

// 折线图示例
const lineOption = computed(() => ({
  backgroundColor: 'transparent',
  grid: { top: 22, right: 8, bottom: 4, left: 4, containLabel: true },
  legend: { textStyle: { color: chartPalette.value.legend, fontSize: 9 } },
  xAxis: { axisLine: { lineStyle: { color: chartPalette.value.axis } },
           axisLabel: { color: chartPalette.value.label, fontSize: 9 } },
  yAxis: { splitLine: { lineStyle: { color: chartPalette.value.split } },
           axisLine: { show: false },
           axisLabel: { color: chartPalette.value.label, fontSize: 9 } },
  series: [{
    type: 'line', smooth: false, symbol: 'circle', symbolSize: 5,
    lineStyle: { color: chartPalette.value.primary, width: 4 },
    itemStyle: { color: chartPalette.value.primary, borderColor: '#fff', borderWidth: 1.5 },
    areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[
      { offset: 0, color: 'rgba(111,201,168,.18)' },
      { offset: 1, color: 'rgba(111,201,168,0)' } ]) },
  }],
  tooltip: { ...tip.value },
}))
```

### 10.5 ChartComponent 渲染壳（ECharts 自适应封装）
封装 init / setOption / ResizeObserver / dispose，配合 `.chart-fill` 实现容器自适应。
```vue
<template><div ref="chartRef" :style="{ width, height }"></div></template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
const props = withDefaults(defineProps<{ option: any; width?: string; height?: string }>(),
  { width: '100%', height: '200px' })
const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null
let ro: ResizeObserver | null = null
onMounted(() => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value, null, { renderer: 'canvas' })
  chart.setOption(props.option)
  window.addEventListener('resize', () => chart?.resize())
  ro = new ResizeObserver(() => chart?.resize())
  ro.observe(chartRef.value)
  nextTick(() => chart?.resize())
})
watch(() => props.option, (o) => chart?.setOption(o, true), { deep: true })
onUnmounted(() => { ro?.disconnect(); chart?.dispose(); chart = null })
</script>
```

---

## 11. 主题切换机制

### 11.1 原理
1. CSS 端用 `:root[data-ui-style='xxx']` 覆盖变量
2. JS 端改 `<html data-ui-style>` 属性即触发整套换肤
3. `localStorage` 持久化选择，刷新后保持
4. 图表通过 `chartPalette` 的 computed 依赖 `uiStyle` 自动重算

### 11.2 三层联动换肤
| 层 | 切换方式 | 是否自动联动 |
|----|----------|--------------|
| 组件 CSS（`.card` 等） | `var(--xxx)` 直接读取 | ✅ 自动 |
| 图标/SVG 辉光 | CSS 选择器 `.fz-glass svg` | ✅ 自动 |
| ECharts canvas | `getComputedStyle` 读 `--chart-*` | ⚠️ 需 `chartPalette` computed 重算 |

### 11.3 极透底可读性补偿（全局规则）
深色极透背景上的 SVG 线稿图标会发飘看不清，统一加描边光补偿：
```css
.fz-glass svg, .glass-panel svg, .card svg {
  filter: drop-shadow(0 0 2px rgba(0,0,0,.85))
          drop-shadow(0 0 1px rgb(var(--primary-rgb)/.45));
}
/* 用 currentColor 的默认图标整体提亮 */
.fz-glass svg[stroke='currentColor'], .card svg[stroke='currentColor'] {
  color: #e9f7ff;
}
```

---

## 12. 快速接入指南

### 步骤 1：引入核心样式
将 `:root { ... }` 设计令牌（见第 3 章）+ 全局背景 + 组件类（见第 7 章）放入项目的全局 CSS。
> 若用 Tailwind CSS v4，在文件顶部加 `@import "tailwindcss";`。

### 步骤 2：接入主题切换（Vue 3 示例）
复制第 10.3 节的 `uiSettings.ts`，提供 8 套主题切换。在 App 启动时调用一次 `document.documentElement.setAttribute('data-ui-style', uiStyle.value)`。

### 步骤 3：挑选/精简主题
按业务场景选用 1~N 套主题（见第 5 章）。最小可用只需 1 套默认 + `:root[data-ui-style]` 覆盖结构。

### 步骤 4：按需接入图表（可选）
若用 ECharts，复制 `chartPalette` 读取层 + `ChartComponent.vue` 渲染壳（见第 10 章）。

### 步骤 5：搭骨架
按第 8 章布局：HUD Frame 外框 + Header 浮条 + 双侧栏浮层 + 底部导航。

### 最小 HTML 验证示例（无需框架）
```html
<!doctype html>
<html lang="zh-CN" data-ui-style="clear">
<head>
  <style>
    /* 粘贴：第3章令牌 + 第5章任一主题 + 第7章 .card/.card-title */
    :root { --primary:#4ea8c8; --primary-rgb:78,168,200; /* ... 其余令牌 */ }
    .card { /* ... 第7.1节 */ }
    .card-title { /* ... 第7.2节 */ }
  </style>
</head>
<body>
  <div class="card" style="width:320px;">
    <div class="card-title">设备概览</div>
    <p>内容区</p>
  </div>
</body>
</html>
```

---

## 附录：类名速查表

| 类名 | 章节 | 一句话 |
|------|------|--------|
| `.card` | 7.1 | 切角科技面板（最常用容器） |
| `.card-title` | 7.2 | 科技横幅条标题 |
| `.card-fill` / `.card-body` | 7.1 | 卡片内 flex 撑满区 |
| `.glass-panel` | 7.3 | 切角玻璃浮层（场景叠加） |
| `.fz-glass` | 7.4 | 统一黑色玻璃浮窗（弹窗/详情） |
| `.fz-title` / `.fz-row` / `.fz-close` | 7.5 | 浮窗配套小件 |
| `.kpi-value` / `.kpi-label` | 7.6 | KPI 大数字 |
| `.status-dot.running/.error/...` | 7.7 | 状态点 |
| `.metric-box` / `.data-row` / `.tech-row` | 7.8 | 数据展示件 |
| `.count-badge` / `.level-badge` | 7.8 | 徽章 |
| `.progress-track/fill` | 7.8 | 进度条 |
| `.hud-btn` / `.hud-chip` | 7.8 | HUD 按钮与提示 |
| `.hud-frame` / `.hud-corner` | 8.1 | 全屏 HUD 边框 |
| `.sidebar` | 8.3 | 透明浮层侧栏 |
| `.chart-fill` | 8.4 | 图表填充容器 |
| `.scene-grade` | — | 场景电影感叠加（晕影+天光） |

---

*文档版本：v1.0 · 设计语言：曜蓝机甲 Tech HUD · 适用：大屏数字孪生 / 工业监控 / 智慧中台*
