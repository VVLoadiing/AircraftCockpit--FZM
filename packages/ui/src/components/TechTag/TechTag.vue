<script setup lang="ts">
/**
 * TechTag — 科技标签（可关闭）
 * 切角 + 语义色变体 + 可选关闭按钮。
 */
import type { SemanticType } from '../../types'

withDefaults(
  defineProps<{
    /** 着色 */
    type?: '' | SemanticType
    /** 是否可关闭 */
    closable?: boolean
  }>(),
  {
    type: '',
    closable: false,
  },
)

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <span class="fzm-tag" :class="type ? `is-${type}` : ''">
    <span class="fzm-tag__text">
      <slot />
    </span>
    <button v-if="closable" type="button" class="fzm-tag__close" aria-label="关闭" @click="$emit('close')">
      <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  </span>
</template>

<style scoped>
.fzm-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--primary-lighter);
  background: rgb(var(--primary-rgb) / 0.16);
  border: 1px solid rgb(var(--primary-rgb) / 0.35);
  border-radius: var(--radius-sm);
  /* 左上+右下切角 */
  clip-path: polygon(
    4px 0,
    100% 0,
    100% calc(100% - 4px),
    calc(100% - 4px) 100%,
    0 100%,
    0 4px
  );
  line-height: 1;
}

.fzm-tag.is-success {
  color: var(--success-light);
  background: rgb(var(--success-rgb) / 0.16);
  border-color: rgb(var(--success-rgb) / 0.35);
}

.fzm-tag.is-warning {
  color: var(--warning-light);
  background: rgb(var(--warning-rgb) / 0.16);
  border-color: rgb(var(--warning-rgb) / 0.35);
}

.fzm-tag.is-danger {
  color: var(--danger-light);
  background: rgb(var(--danger-rgb) / 0.18);
  border-color: rgb(var(--danger-rgb) / 0.4);
}

.fzm-tag.is-info {
  color: var(--primary-lighter);
}

.fzm-tag__text {
  letter-spacing: 0.3px;
}

.fzm-tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 13px;
  height: 13px;
  padding: 0;
  border-radius: 50%;
  color: inherit;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.15s ease;
}

.fzm-tag__close:hover {
  opacity: 1;
  background: rgb(255, 255, 255, 0.15);
}
</style>
