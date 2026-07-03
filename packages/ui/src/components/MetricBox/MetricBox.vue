<script setup lang="ts">
/**
 * MetricBox — Mini 统计小方块
 * 来源：UI设计系统规范.md 第 7.8 节（.metric-box）
 * 切角 + 顶部 2px 扫光线 + hover 辉光。
 */
import type { SemanticType } from '../../types'

withDefaults(
  defineProps<{
    /** 数值 */
    value: string | number
    /** 标签 */
    label: string
    /** 单位 */
    unit?: string
    /** 着色 */
    type?: '' | SemanticType
  }>(),
  {
    unit: '',
    type: '',
  },
)
</script>

<template>
  <div class="fzm-metric" :class="type ? `is-${type}` : ''">
    <div class="fzm-metric__value">
      <span class="fzm-metric__num">{{ value }}</span>
      <span v-if="unit" class="fzm-metric__unit">{{ unit }}</span>
    </div>
    <div class="fzm-metric__label">{{ label }}</div>
  </div>
</template>

<style scoped>
.fzm-metric {
  position: relative;
  padding: 10px 12px;
  background: rgb(var(--primary-rgb) / 0.06);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  clip-path: polygon(
    var(--notch) 0,
    100% 0,
    100% calc(100% - var(--notch)),
    calc(100% - var(--notch)) 100%,
    0 100%,
    0 var(--notch)
  );
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
}

/* 顶部 2px 扫光线 */
.fzm-metric::before {
  content: '';
  position: absolute;
  top: 0;
  left: 16%;
  right: 16%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(var(--primary-rgb) / 0.75),
    transparent
  );
}

.fzm-metric:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-glow-cyan);
}

.fzm-metric__value {
  display: flex;
  align-items: baseline;
  gap: 2px;
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 800;
  color: var(--primary-lighter);
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85), 0 0 12px rgb(var(--primary-rgb) / 0.5);
}

.fzm-metric__unit {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.85;
}

.fzm-metric__label {
  margin-top: 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--text-muted);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.75);
}

.fzm-metric.is-success .fzm-metric__value {
  color: var(--success-light);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85), 0 0 12px rgb(var(--success-rgb) / 0.5);
}

.fzm-metric.is-warning .fzm-metric__value {
  color: var(--warning-light);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85), 0 0 12px rgb(var(--warning-rgb) / 0.5);
}

.fzm-metric.is-danger .fzm-metric__value {
  color: var(--danger-light);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85), 0 0 12px rgb(var(--danger-rgb) / 0.5);
}
</style>
