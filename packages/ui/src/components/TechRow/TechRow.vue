<script setup lang="ts">
/**
 * TechRow — 科技列表项
 * 来源：UI设计系统规范.md 第 7.8 节（.tech-row）
 * 左 2px 强调边 + hover/active 加深。
 */
withDefaults(
  defineProps<{
    /** 激活态 */
    active?: boolean
  }>(),
  {
    active: false,
  },
)
</script>

<template>
  <div class="fzm-tech-row" :class="{ 'is-active': active }">
    <slot name="prefix" />
    <div class="fzm-tech-row__main">
      <slot />
    </div>
    <slot name="suffix" />
  </div>
</template>

<style scoped>
.fzm-tech-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px 8px 12px;
  font-size: 12px;
  color: var(--text-secondary);
  border-left: 2px solid rgb(var(--primary-rgb) / 0.4);
  background: rgb(var(--primary-rgb) / 0.04);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  transition: all 0.18s ease;
  cursor: default;
}

.fzm-tech-row:hover {
  background: var(--bg-hover);
  border-left-color: var(--primary);
  color: var(--text-primary);
}

.fzm-tech-row.is-active {
  background: rgb(var(--primary-rgb) / 0.16);
  border-left-color: var(--primary);
  color: var(--text-primary);
  box-shadow: inset 0 0 16px rgb(var(--primary-rgb) / 0.1);
}

.fzm-tech-row__main {
  flex: 1;
  min-width: 0;
}
</style>
