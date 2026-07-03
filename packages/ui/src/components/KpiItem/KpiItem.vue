<script setup lang="ts">
/**
 * KpiItem — KPI 大数字
 * 来源：UI设计系统规范.md 第 7.6 节
 *
 * 用途：大屏顶部的关键指标展示，等宽数字 + 辉光。
 * 多个 KpiItem 横向排列时会自动出现分隔竖线。
 */
import type { SemanticType } from '../../types'

withDefaults(
  defineProps<{
    /** 数值 */
    value: string | number
    /** 标签 */
    label: string
    /** 数值着色（语义色变体） */
    type?: '' | SemanticType
    /** 数值单位（后缀） */
    unit?: string
  }>(),
  {
    type: '',
    unit: '',
  },
)
</script>

<template>
  <div class="fzm-kpi-item">
    <div class="fzm-kpi-item__value" :class="type ? `is-${type}` : ''">
      <span class="fzm-kpi-item__num">{{ value }}</span>
      <span v-if="unit" class="fzm-kpi-item__unit">{{ unit }}</span>
    </div>
    <div class="fzm-kpi-item__label">{{ label }}</div>
  </div>
</template>

<style scoped>
.fzm-kpi-item {
  text-align: center;
  padding: 4px 12px;
  position: relative;
}

/* KPI 之间的分隔竖线 */
.fzm-kpi-item + .fzm-kpi-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 22%;
  height: 56%;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent,
    rgb(var(--primary-rgb) / 0.4),
    transparent
  );
}

.fzm-kpi-item__value {
  font-size: 22px;
  font-weight: 800;
  font-family: var(--font-mono);
  line-height: 1.2;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85), 0 0 16px rgb(var(--primary-rgb) / 0.55);
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
}

.fzm-kpi-item__value.is-success {
  color: var(--success);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85), 0 0 16px rgb(var(--success-rgb) / 0.55);
}

.fzm-kpi-item__value.is-warning {
  color: var(--warning);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85), 0 0 16px rgb(var(--warning-rgb) / 0.55);
}

.fzm-kpi-item__value.is-danger {
  color: var(--danger);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85), 0 0 16px rgb(var(--danger-rgb) / 0.55);
}

.fzm-kpi-item__value.is-info {
  color: var(--primary);
}

.fzm-kpi-item__unit {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.85;
}

.fzm-kpi-item__label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  margin-top: 3px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.75);
}
</style>
