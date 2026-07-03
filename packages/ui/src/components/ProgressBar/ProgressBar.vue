<script setup lang="ts">
/**
 * ProgressBar — 切角进度条（带流光）
 * 来源：UI设计系统规范.md 第 7.8 节（.progress-track/.progress-fill）
 */
import { computed } from 'vue'
import type { SemanticType } from '../../types'

const props = withDefaults(
  defineProps<{
    /** 进度值 0-100 */
    value: number
    /** 最大值 */
    max?: number
    /** 着色（语义色变体） */
    type?: '' | SemanticType
    /** 是否显示流光 */
    shimmer?: boolean
    /** 是否显示百分比文字 */
    showText?: boolean
  }>(),
  {
    max: 100,
    type: '',
    shimmer: true,
    showText: false,
  },
)

const percent = computed(() => {
  const p = Math.min(100, Math.max(0, (props.value / props.max) * 100))
  return p
})
</script>

<template>
  <div class="fzm-progress">
    <div class="fzm-progress__track">
      <div
        class="fzm-progress__fill"
        :class="[type ? `is-${type}` : '', { 'is-shimmer': shimmer }]"
        :style="{ width: percent + '%' }"
      />
    </div>
    <span v-if="showText" class="fzm-progress__text">{{ percent.toFixed(0) }}%</span>
  </div>
</template>

<style scoped>
.fzm-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fzm-progress__track {
  flex: 1;
  height: 6px;
  background: rgb(var(--primary-rgb) / 0.18);
  border: 1px solid rgb(var(--primary-rgb) / 0.16);
  clip-path: polygon(
    3px 0,
    100% 0,
    calc(100% - 3px) 100%,
    0 100%
  );
  overflow: hidden;
  position: relative;
}

.fzm-progress__fill {
  height: 100%;
  background: var(--primary-gradient);
  box-shadow: 0 0 8px rgb(var(--primary-rgb) / 0.6);
  position: relative;
  transition: width 0.4s ease;
}

.fzm-progress__fill.is-success {
  background: linear-gradient(135deg, var(--success), var(--success-light));
  box-shadow: 0 0 8px rgb(var(--success-rgb) / 0.6);
}

.fzm-progress__fill.is-warning {
  background: linear-gradient(135deg, var(--warning), var(--warning-light));
  box-shadow: 0 0 8px rgb(var(--warning-rgb) / 0.6);
}

.fzm-progress__fill.is-danger {
  background: linear-gradient(135deg, var(--danger), var(--danger-light));
  box-shadow: 0 0 8px rgb(var(--danger-rgb) / 0.6);
}

/* 流光 */
.fzm-progress__fill.is-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent);
  background-size: 200% 100%;
  animation: fzm-shimmer 2.5s linear infinite;
}

.fzm-progress__text {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  min-width: 32px;
  text-align: right;
}

@keyframes fzm-shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}
</style>
