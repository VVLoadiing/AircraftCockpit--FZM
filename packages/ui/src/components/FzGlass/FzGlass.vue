<script setup lang="ts">
/**
 * FzGlass — 全局统一黑色玻璃浮窗基类
 * 来源：UI设计系统规范.md 第 7.4 / 7.5 节
 *
 * 所有弹窗 / 详情卡 / 标签条 / 配置面板的统一外观：
 * 深黑透明 + 强模糊 + 青色辉光 + 顶部扫光 + 右上角角光。
 *
 * 配套子组件：FzGlassTitle（标题条）、FzGlassRow（数据行）、FzGlassClose（关闭按钮）。
 */
withDefaults(
  defineProps<{
    /** 更强不透明的玻璃底 */
    strong?: boolean
    /** 自定义标签 */
    tag?: string
  }>(),
  {
    strong: false,
    tag: 'div',
  },
)
</script>

<template>
  <component :is="tag" class="fzm-fz-glass" :class="{ 'fzm-fz-glass--strong': strong }">
    <slot />
  </component>
</template>

<style scoped>
.fzm-fz-glass {
  position: relative;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: var(--glass-radius);
  color: var(--text-primary);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: var(--glass-shadow);
}

.fzm-fz-glass--strong {
  background: var(--glass-bg-strong);
  backdrop-filter: var(--glass-blur-strong);
  -webkit-backdrop-filter: var(--glass-blur-strong);
}

/* 顶部 1px 扫光高光 */
.fzm-fz-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(
      90deg,
      transparent 8%,
      rgb(var(--primary-rgb) / 0.55) 50%,
      transparent 92%
    )
    top center / 64% 1px no-repeat;
}

/* 右上角微小角光（机甲仪表感） */
.fzm-fz-glass::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 22px;
  height: 22px;
  border-top: 1px solid rgb(var(--primary-rgb) / 0.55);
  border-right: 1px solid rgb(var(--primary-rgb) / 0.55);
  border-top-right-radius: inherit;
  pointer-events: none;
  filter: drop-shadow(0 0 4px rgb(var(--primary-rgb) / 0.45));
}
</style>
