<script setup lang="ts">
/**
 * JumpLink — 大屏组件区域的可点击跳转壳
 * 包裹任意内容，hover 时右上角显示「查看组件 →」提示，
 * 点击调用 navigateToComponent 跳转到组件演示页锚点。
 */
import { inject } from 'vue'

const props = defineProps<{
  /** 目标组件锚点（comp-xxx 的 xxx 部分） */
  to: string
  /** 提示文字（组件名） */
  label?: string
}>()

const navigateToComponent = inject<(anchor: string) => void>('navigateToComponent')!

function go() {
  navigateToComponent(props.to)
}
</script>

<template>
  <div class="jump-link" @click="go">
    <span class="jump-link__badge">
      <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
      {{ label || '查看组件' }}
    </span>
    <slot />
  </div>
</template>

<style scoped>
.jump-link {
  position: relative;
  cursor: pointer;
  border-radius: var(--radius-sm);
  outline: 1.5px solid transparent;
  outline-offset: 2px;
  transition: outline-color 0.2s ease;
}

/* hover 时显示提示徽标 + 描边 */
.jump-link:hover {
  outline-color: rgb(var(--primary-rgb) / 0.6);
}

.jump-link__badge {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--text-on-primary);
  background: var(--primary-gradient);
  border-radius: 3px;
  opacity: 0;
  transform: translateY(-3px);
  transition: all 0.2s ease;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 0 8px rgb(var(--primary-rgb) / 0.6);
}

.jump-link:hover .jump-link__badge {
  opacity: 1;
  transform: translateY(0);
}
</style>
