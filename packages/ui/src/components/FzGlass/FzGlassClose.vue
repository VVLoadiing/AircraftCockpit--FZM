<script setup lang="ts">
/**
 * FzGlassClose — 浮窗关闭按钮
 * 来源：UI设计系统规范.md 第 7.5 节（.fz-close）
 */
defineEmits<{
  /** 点击关闭按钮时触发（由父级浮窗监听以关闭自身） */
  (e: 'close'): void
}>()
</script>

<template>
  <button type="button" class="fzm-fz-close" aria-label="关闭" @click="$emit('close')">
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  </button>
</template>

<style scoped>
/* 关闭按钮：弱化的小方块，hover 时变红提示危险操作 */
.fzm-fz-close {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.18s ease;
  flex-shrink: 0;
  padding: 0;
}

.fzm-fz-close:hover {
  color: #fff;
  background: rgb(var(--danger-rgb) / 0.28);
  border-color: rgb(var(--danger-rgb) / 0.55);
}
</style>
