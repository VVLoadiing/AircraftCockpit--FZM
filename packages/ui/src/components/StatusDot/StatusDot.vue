<script setup lang="ts">
/**
 * StatusDot — 状态点
 * 来源：UI设计系统规范.md 第 7.7 节
 *
 * running（运行）脉冲翠绿，error（错误）闪烁，其余静态发光。
 */
import type { StatusType } from '../../types'

withDefaults(
  defineProps<{
    /** 状态类型 */
    type?: StatusType
    /** 状态文字；传 'auto' 则自动取 type 对应中文（运行/待机…） */
    label?: string
  }>(),
  {
    type: 'running',
    label: '',
  },
)

const LABELS: Record<StatusType, string> = {
  running: '运行',
  standby: '待机',
  stopped: '停止',
  error: '故障',
  maintenance: '维护',
  offline: '离线',
}
</script>

<template>
  <span class="fzm-status">
    <span class="fzm-status__dot" :class="`is-${type}`" />
    <span v-if="label" class="fzm-status__text">
      <slot>{{ label === 'auto' ? LABELS[type] : label }}</slot>
    </span>
  </span>
</template>

<style scoped>
.fzm-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.fzm-status__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.fzm-status__dot.is-running {
  background: var(--success);
  box-shadow:
    0 0 0 3px rgb(var(--status-running-rgb) / 0.18),
    0 0 8px rgb(var(--status-running-rgb) / 0.65);
  animation: fzm-pulseGlow 2s ease-in-out infinite;
}

.fzm-status__dot.is-standby {
  background: var(--primary);
  box-shadow:
    0 0 0 3px rgb(var(--primary-rgb) / 0.18),
    0 0 6px rgb(var(--primary-rgb) / 0.55);
}

.fzm-status__dot.is-stopped {
  background: #94a3b8;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.16);
}

.fzm-status__dot.is-error {
  background: #ff5f5f;
  box-shadow:
    0 0 0 3px rgba(255, 95, 95, 0.2),
    0 0 10px rgba(255, 95, 95, 0.7);
  animation: fzm-blink 1s infinite;
}

.fzm-status__dot.is-maintenance {
  background: var(--warning);
  box-shadow:
    0 0 0 3px rgb(var(--warning-rgb) / 0.18),
    0 0 6px rgb(var(--warning-rgb) / 0.55);
}

.fzm-status__dot.is-offline {
  background: #64748b;
}

.fzm-status__text {
  font-size: 11px;
  color: var(--text-secondary);
}

@keyframes fzm-pulseGlow {

  0%,
  100% {
    box-shadow:
      0 0 0 3px rgb(var(--status-running-rgb) / 0.18),
      0 0 6px rgb(var(--status-running-rgb) / 0.5);
  }

  50% {
    box-shadow:
      0 0 0 3px rgb(var(--status-running-rgb) / 0.3),
      0 0 12px rgb(var(--status-running-rgb) / 0.85);
  }
}

@keyframes fzm-blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.25;
  }
}
</style>
