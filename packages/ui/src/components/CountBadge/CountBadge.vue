<script setup lang="ts">
/**
 * CountBadge — 计数徽章
 * 来源：UI设计系统规范.md 第 7.8 节（.count-badge）
 * 切角 + 主色边框。
 */
import type { SemanticType } from '../../types'

withDefaults(
  defineProps<{
    /** 数值 */
    value: string | number
    /** 着色（语义色变体） */
    type?: '' | SemanticType
  }>(),
  {
    type: '',
  },
)
</script>

<template>
  <span class="fzm-count-badge" :class="type ? `is-${type}` : ''">{{ value }}</span>
</template>

<style scoped>
.fzm-count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 18px;
  padding: 0 6px;
  font-size: 10px;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--primary-lighter);
  background: rgb(var(--primary-rgb) / 0.18);
  border: 1px solid var(--primary-border);
  border-radius: var(--radius-sm);
  clip-path: polygon(
    4px 0,
    100% 0,
    100% calc(100% - 4px),
    calc(100% - 4px) 100%,
    0 100%,
    0 4px
  );
  line-height: 1;
  letter-spacing: 0.5px;
}

/* —— 语义色变体：数字主色 + 弱底/描边高亮 —— */
.fzm-count-badge.is-success {
  color: var(--success-light);
  background: rgb(var(--success-rgb) / 0.18);
  border-color: rgb(var(--success-rgb) / 0.42);
}

.fzm-count-badge.is-warning {
  color: var(--warning-light);
  background: rgb(var(--warning-rgb) / 0.18);
  border-color: rgb(var(--warning-rgb) / 0.42);
}

.fzm-count-badge.is-danger {
  color: var(--danger-light);
  background: rgb(var(--danger-rgb) / 0.22);
  border-color: rgb(var(--danger-rgb) / 0.5);
}

/* info 仅改主色（复用 primary，弱提示，不加底/边） */
.fzm-count-badge.is-info {
  color: var(--primary-lighter);
}
</style>
