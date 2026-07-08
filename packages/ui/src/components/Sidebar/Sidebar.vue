<script setup lang="ts">
/**
 * Sidebar — 透明浮层侧栏
 * 来源：UI设计系统规范.md 第 8.3 节
 *
 * 卡片直接浮于场景之上。直接子元素会获得错峰 fadeIn 入场动画。
 */
import type { SidebarWidth } from '../../types'

withDefaults(
  defineProps<{
    /** 宽度变体 */
    width?: SidebarWidth
    /** 自定义宽度（覆盖 width 变体，需带单位） */
    customWidth?: string
  }>(),
  {
    width: 'normal',
  },
)
</script>

<template>
  <aside
    class="fzm-sidebar"
    :class="`is-${width}`"
    :style="customWidth ? { width: customWidth } : undefined"
  >
    <slot />
  </aside>
</template>

<style scoped>
.fzm-sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  padding: var(--sidebar-pad);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--sidebar-gap);
  background: var(--bg-sidebar);
  position: relative;
}

/* —— 宽度变体：normal 走基础 --sidebar-w，narrow/wide 覆盖为定值 —— */
.fzm-sidebar.is-narrow {
  width: 300px;
}

.fzm-sidebar.is-wide {
  width: 340px;
}

/*
 * 直接子元素错峰入场动画。
 * CSS 无法循环，故手写 8 档 delay（每档 +0.06s）；超出第 8 个不再错峰但仍播放动画。
 * 紧凑单行写法以降低样板噪音。
 */
.fzm-sidebar > :deep(*) {
  animation: fzm-sidebar-fadeIn 0.45s ease both;
}
.fzm-sidebar > :deep(*:nth-child(2)) { animation-delay: 0.06s; }
.fzm-sidebar > :deep(*:nth-child(3)) { animation-delay: 0.12s; }
.fzm-sidebar > :deep(*:nth-child(4)) { animation-delay: 0.18s; }
.fzm-sidebar > :deep(*:nth-child(5)) { animation-delay: 0.24s; }
.fzm-sidebar > :deep(*:nth-child(6)) { animation-delay: 0.3s; }
.fzm-sidebar > :deep(*:nth-child(7)) { animation-delay: 0.36s; }
.fzm-sidebar > :deep(*:nth-child(8)) { animation-delay: 0.42s; }

@keyframes fzm-sidebar-fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
