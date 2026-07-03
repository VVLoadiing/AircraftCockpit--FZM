<script setup lang="ts">
/**
 * HudChip — HUD 提示标签
 * 来源：UI设计系统规范.md 第 7.8 节（.hud-chip）
 * 小切角 + 半透底。
 */
import type { SemanticType } from '../../types'

withDefaults(
  defineProps<{
    type?: '' | SemanticType
  }>(),
  {
    type: '',
  },
)
</script>

<template>
  <span class="fzm-hud-chip" :class="type ? `is-${type}` : ''">
    <slot />
  </span>
</template>

<style scoped>
.fzm-hud-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 20px;
  padding: 0 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--primary-lighter);
  background: rgb(var(--primary-rgb) / 0.14);
  border: 1px solid rgb(var(--primary-rgb) / 0.3);
  border-radius: var(--radius-sm);
  clip-path: polygon(
    4px 0,
    100% 0,
    calc(100% - 4px) 100%,
    0 100%
  );
  line-height: 1;
}

.fzm-hud-chip.is-success {
  color: var(--success-light);
  background: rgb(var(--success-rgb) / 0.14);
  border-color: rgb(var(--success-rgb) / 0.3);
}

.fzm-hud-chip.is-warning {
  color: var(--warning-light);
  background: rgb(var(--warning-rgb) / 0.14);
  border-color: rgb(var(--warning-rgb) / 0.3);
}

.fzm-hud-chip.is-danger {
  color: var(--danger-light);
  background: rgb(var(--danger-rgb) / 0.16);
  border-color: rgb(var(--danger-rgb) / 0.35);
}

.fzm-hud-chip.is-info {
  color: var(--primary-lighter);
}
</style>
