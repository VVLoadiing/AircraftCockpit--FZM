<script setup lang="ts">
/**
 * GlassPanel — 切角玻璃浮层
 * 来源：UI设计系统规范.md 第 7.3 节
 *
 * 用于 3D 场景之上的浮层（如顶部 KPI 带），八边形切角 + 背景模糊。
 */
withDefaults(
  defineProps<{
    /** 自定义标签 */
    tag?: string
  }>(),
  {
    tag: 'div',
  },
)
</script>

<template>
  <component :is="tag" class="fzm-glass-panel">
    <slot />
  </component>
</template>

<style scoped>
.fzm-glass-panel {
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-card);
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  box-shadow: var(--shadow-card);
  /* 八边形切角（四角各切） */
  clip-path: polygon(
    var(--notch) 0,
    calc(100% - var(--notch)) 0,
    100% var(--notch),
    100% calc(100% - var(--notch)),
    calc(100% - var(--notch)) 100%,
    var(--notch) 100%,
    0 calc(100% - var(--notch)),
    0 var(--notch)
  );
}

/* 顶部扫光高光线 */
.fzm-glass-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
      90deg,
      transparent 10%,
      rgb(var(--primary-rgb) / 0.65) 50%,
      transparent 90%
    )
    top center / 70% 1.5px no-repeat;
}
</style>
