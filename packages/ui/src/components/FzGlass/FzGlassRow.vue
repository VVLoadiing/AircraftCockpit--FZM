<script setup lang="ts">
/**
 * FzGlassRow — 浮窗数据行（键 / 值）
 * 来源：UI设计系统规范.md 第 7.5 节（.fz-row）
 */
defineProps<{
  /** 键名（也可用 #label 插槽） */
  label?: string
  /** 值（也可用默认插槽） */
  value?: string | number
}>()
</script>

<template>
  <div class="fzm-fz-row">
    <span class="fzm-fz-row__label">
      <slot name="label">{{ label }}</slot>
    </span>
    <b class="fzm-fz-row__value">
      <slot>{{ value }}</slot>
    </b>
  </div>
</template>

<style scoped>
/* 数据行：弱底色 + 弱描边的圆角条，键值两端对齐 */
.fzm-fz-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 9px;
  border-radius: 8px;
  font-size: 11px;
  color: var(--text-secondary);
  background: rgb(var(--primary-rgb) / 0.05);
  border: 1px solid rgb(var(--primary-rgb) / 0.1);
}

/* 值：等宽数字 + 高亮，便于在深底上读数 */
.fzm-fz-row__value {
  font-family: var(--font-mono);
  font-weight: 700;
  color: #f4fcff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85);
}
</style>
