<script setup lang="ts">
/**
 * FzGlassTitle — 浮窗标题条（左色条 + 发光文字）
 * 来源：UI设计系统规范.md 第 7.5 节（.fz-title）
 */
defineProps<{
  /** 标题文字（也可用默认插槽） */
  title?: string
}>()
</script>

<template>
  <div class="fzm-fz-title">
    <slot>{{ title }}</slot>
  </div>
</template>

<style scoped>
.fzm-fz-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #f4fcff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8), 0 0 10px rgb(var(--primary-rgb) / 0.45);
}

/* 最左侧色条 */
.fzm-fz-title::before {
  content: '';
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: linear-gradient(180deg, var(--primary), var(--primary-dark));
  box-shadow: 0 0 8px rgb(var(--primary-rgb) / 0.7);
  flex-shrink: 0;
}
</style>
