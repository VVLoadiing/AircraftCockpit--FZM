<script setup lang="ts">
/**
 * HudButton — HUD 操作按钮
 * 来源：UI设计系统规范.md 第 7.8 节（.hud-btn）
 * 切角 + 深蓝底 + 内辉光。
 */
import type { SemanticType } from '../../types'

withDefaults(
  defineProps<{
    /** 按钮类型 */
    type?: 'default' | 'primary' | SemanticType
    /** 禁用 */
    disabled?: boolean
    /** 原生 type */
    nativeType?: 'button' | 'submit' | 'reset'
  }>(),
  {
    type: 'default',
    disabled: false,
    nativeType: 'button',
  },
)
</script>

<template>
  <button
    :type="nativeType"
    class="fzm-hud-btn"
    :class="`is-${type}`"
    :disabled="disabled"
  >
    <slot name="icon" />
    <span class="fzm-hud-btn__text">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.fzm-hud-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 7px 16px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--text-primary);
  background: linear-gradient(180deg, rgba(8, 44, 76, 0.9), rgba(4, 26, 48, 0.92));
  border: 1px solid rgb(var(--primary-rgb) / 0.45);
  clip-path: polygon(
    8px 0,
    100% 0,
    calc(100% - 8px) 100%,
    0 100%
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.fzm-hud-btn:hover:not(:disabled) {
  border-color: rgb(var(--primary-rgb) / 0.75);
  color: var(--accent-light);
  box-shadow:
    0 6px 18px rgb(var(--accent-rgb) / 0.3),
    inset 0 0 16px rgb(var(--accent-rgb) / 0.18);
}

.fzm-hud-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.fzm-hud-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* 主按钮：主题色实底 */
.fzm-hud-btn.is-primary {
  background: var(--primary-gradient);
  color: var(--text-on-primary);
}

.fzm-hud-btn.is-primary:hover:not(:disabled) {
  box-shadow: var(--shadow-primary);
  color: var(--text-on-primary);
}

/* —— 语义色变体：描边 + 文字主色，hover 时对应辉光 —— */
.fzm-hud-btn.is-success {
  border-color: rgb(var(--success-rgb) / 0.55);
  color: var(--success-light);
}

.fzm-hud-btn.is-success:hover:not(:disabled) {
  box-shadow: var(--shadow-glow-green), inset 0 0 16px rgb(var(--success-rgb) / 0.2);
}

.fzm-hud-btn.is-warning {
  border-color: rgb(var(--warning-rgb) / 0.55);
  color: var(--warning-light);
}

.fzm-hud-btn.is-warning:hover:not(:disabled) {
  box-shadow: var(--shadow-glow-warning), inset 0 0 16px rgb(var(--warning-rgb) / 0.2);
}

.fzm-hud-btn.is-danger {
  border-color: rgb(var(--danger-rgb) / 0.55);
  color: var(--danger-light);
}

.fzm-hud-btn.is-danger:hover:not(:disabled) {
  box-shadow: var(--shadow-glow-danger), inset 0 0 16px rgb(var(--danger-rgb) / 0.2);
}

/* info：仅改描边（复用 primary），颜色保持默认 */
.fzm-hud-btn.is-info {
  border-color: rgb(var(--primary-rgb) / 0.55);
}
</style>
