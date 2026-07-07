# AppHeader 应用头部

> 应用级机甲风头部浮条，复刻设计文档第 8.2 节大屏标准布局的顶部浮条。
> 对应文档：新增组件（布局类）

视觉特征：
- 毛玻璃浮条底 + 左上/右上 **HUD 切角标记**
- 左侧：logo 区 + **渐变机甲标题**（白→主题色）
- 中间：**电流母线 spacer**（流动脉冲 + 旋转菱形锚点，机甲能量管线感）
- 右侧：状态组（地域/天气/系统状态/告警铃铛/实时时钟）+ 用户菜单
- 底部：**扫光横线**

用户菜单内置：**主题切换**（下拉，带彩色圆点）+ 全屏切换。

## 基础用法

```vue
<script setup lang="ts">
import { AppHeader } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <AppHeader
    title="富山基地 · 钻孔中心数字孪生平台"
    subtitle="FUSHAN DRILLING CENTER · DIGITAL TWIN SYSTEM"
    region="珠海·富山"
    weather="多云 25°C"
    :alarm-count="12"
  />
</template>
```

## 完整示例（带 logo + 用户菜单）

```vue
<AppHeader
  :logo="logoUrl"
  title="数字孪生平台"
  subtitle="DIGITAL TWIN SYSTEM"
  region="珠海·富山"
  weather="多云 25°C"
  :alarm-count="factoryKPI.todayAlarms"
  system-status="系统运行中"
  user-name="管理员"
  show-user-menu
  floating
  @alarm-click="goToAlerts"
  @theme-change="onThemeChange"
/>
```

## Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | `'曜蓝机甲 Tech HUD'` | 主标题（渐变文字） |
| `subtitle` | `string` | `'TECH HUD · ...'` | 副标题（英文/小字） |
| `logo` | `string` | `''` | logo 图片地址（不传则显示主题色方块占位） |
| `region` | `string` | `''` | 地域文字（如「珠海·富山」），空则不显示 |
| `weather` | `string` | `''` | 天气文字（如「多云 25°C」），空则不显示 |
| `alarmCount` | `number` | `0` | 告警数（铃铛角标，>99 显示 99+，0 不显示角标） |
| `systemStatus` | `string` | `'系统运行中'` | 系统状态文字 |
| `userName` | `string` | `'管理员'` | 用户名 |
| `showUserMenu` | `boolean` | `true` | 是否显示用户菜单（主题切换/全屏） |
| `floating` | `boolean` | `false` | 是否浮动定位（`fixed` 贴顶）；false 则随文档流 |

## Slots

| 名称 | 说明 |
|------|------|
| `actions` | 状态组前置插槽（插入额外的 chip / 按钮） |
| `menu` | 用户菜单底部追加的自定义菜单项 |

## Events

| 名称 | 参数 | 说明 |
|------|------|------|
| `alarm-click` | — | 点击告警铃铛时触发 |
| `theme-change` | `(value: UiStyle['id'])` | 用户在菜单切换主题时触发 |

## 内置功能

### 主题切换（用户菜单内）
点击右上角用户头像展开菜单，第一项是**主题切换下拉**（TechSelect，带彩色圆点 + 名称 + 描述），选中即切换 10 套主题，自动持久化。

### 全屏切换
菜单第二项是全屏开关，调用浏览器 Fullscreen API。

### 实时时钟
右侧时间每秒更新，格式 `MM-DD HH:mm:ss`，使用 mono 字体。

::: tip 浮层不被裁切
用户菜单用 `<Teleport to="body">` 渲染到 body，避免被 header 的 `overflow: hidden` 裁切。主题下拉浮层也用实底背景，在任何内容之上清晰可读。
:::

::: tip 电流母线动画
中间的 spacer 是机甲风的核心细节：刻度纹理母线 + 高亮脉冲段循环流动 + 右端空心菱形锚点旋转。已内置 `prefers-reduced-motion` 降级，无障碍场景自动关闭动画。
:::
