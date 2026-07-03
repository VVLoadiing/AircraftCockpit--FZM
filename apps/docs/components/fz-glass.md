# FzGlass 黑色玻璃浮窗

> 全局统一的黑色玻璃浮窗基类，所有弹窗 / 详情卡 / 标签条 / 配置面板的统一外观。
> 对应文档：第 7.4 / 7.5 节

视觉特征：深黑透明 + 28px 强模糊 + 青色辉光 + 顶部 1px 扫光高光 + 右上角微小角光（机甲仪表感）。配套 `FzGlassTitle`（标题条）、`FzGlassRow`（数据行）、`FzGlassClose`（关闭按钮）。

## FzGlass 浮窗容器

```vue
<script setup lang="ts">
import { FzGlass, FzGlassTitle, FzGlassRow, FzGlassClose } from '@fzm/ui'
import '@fzm/ui/styles'
</script>

<template>
  <FzGlass style="padding: 14px; width: 280px">
    <FzGlassTitle title="设备详情" />
    <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 10px">
      <FzGlassRow label="运行时长" value="1,284h" />
      <FzGlassRow label="当前温度" value="68℃" />
    </div>
    <div style="display: flex; justify-content: flex-end; margin-top: 12px">
      <FzGlassClose @close="onClose" />
    </div>
  </FzGlass>
</template>
```

## 加强不透明底

```vue
<FzGlass strong>更强不透明的玻璃底</FzGlass>
```

### FzGlass Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `strong` | `boolean` | `false` | 是否使用更强不透明的玻璃底 |
| `tag` | `string` | `'div'` | 自定义渲染标签 |

## FzGlassTitle 标题条

左色条 + 发光文字。

```vue
<FzGlassTitle title="设备详情" />
<!-- 或插槽 -->
<FzGlassTitle>设备详情 <CountBadge :value="3" /></FzGlassTitle>
```

### FzGlassTitle Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | — | 标题文字（也可用默认插槽） |

## FzGlassRow 数据行

```vue
<FzGlassRow label="运行时长" value="1,284h" />
```

### FzGlassRow Props

| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | `string` | — | 键名（也可用 `#label` 插槽） |
| `value` | `string \| number` | — | 值（也可用默认插槽） |

## FzGlassClose 关闭按钮

```vue
<FzGlassClose @close="visible = false" />
```

### FzGlassClose Events

| 名称 | 说明 |
|------|------|
| `close` | 点击关闭时触发 |
