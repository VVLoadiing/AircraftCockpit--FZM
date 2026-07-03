<script setup lang="ts">
/**
 * DataRow — 数据键值行
 * 来源：UI设计系统规范.md 第 7.8 节（.data-row）
 * hover 变 --bg-hover。
 */
defineProps<{
  /** 键名（也可用 #label 插槽） */
  label?: string
}>()
</script>

<template>
  <div class="fzm-data-row">
    <span class="fzm-data-row__label">
      <slot name="label">{{ label }}</slot>
    </span>
    <span class="fzm-data-row__value">
      <slot />
    </span>
  </div>
</template>

<style scoped>
.fzm-data-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 8px;
  font-size: 12px;
  border-radius: var(--radius-sm);
  transition: background 0.18s ease;
  cursor: default;
}

.fzm-data-row:hover {
  background: var(--bg-hover);
}

.fzm-data-row__label {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.fzm-data-row__value {
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-weight: 600;
  text-align: right;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
}
</style>
