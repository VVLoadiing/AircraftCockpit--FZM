<script setup lang="ts">
/**
 * CountUp — 数字滚动动画
 * KPI 数值从当前值平滑过渡到目标值（requestAnimationFrame + easeOutQuart）。
 * mono 字体 + 主题色辉光，支持千分位、小数、前后缀。
 */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import type { SemanticType } from '../../types'

const props = withDefaults(
  defineProps<{
    /** 目标数值 */
    value: number
    /** 起始值（首次从该值滚起） */
    startValue?: number
    /** 动画时长（ms） */
    duration?: number
    /** 小数位数 */
    decimals?: number
    /** 是否千分位分隔 */
    thousand?: boolean
    /** 前缀 */
    prefix?: string
    /** 后缀/单位 */
    suffix?: string
    /** 着色 */
    type?: '' | SemanticType
    /** 字号 */
    fontSize?: string
  }>(),
  {
    startValue: 0,
    duration: 1200,
    decimals: 0,
    thousand: true,
    prefix: '',
    suffix: '',
    type: '',
    fontSize: '22px',
  },
)

const display = ref(props.startValue)
let raf = 0
let startTime = 0
let fromVal = props.startValue

// easeOutQuart：先快后慢
function ease(t: number) {
  return 1 - Math.pow(1 - t, 4)
}

function format(n: number) {
  const fixed = n.toFixed(props.decimals)
  if (!props.thousand) return fixed
  const [intPart, decPart] = fixed.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decPart !== undefined ? `${grouped}.${decPart}` : grouped
}

function step(ts: number) {
  if (!startTime) startTime = ts
  const progress = Math.min((ts - startTime) / props.duration, 1)
  display.value = fromVal + (props.value - fromVal) * ease(progress)
  if (progress < 1) {
    raf = requestAnimationFrame(step)
  } else {
    display.value = props.value
  }
}

function run() {
  cancelAnimationFrame(raf)
  startTime = 0
  fromVal = display.value
  raf = requestAnimationFrame(step)
}

onMounted(run)

watch(
  () => props.value,
  () => run(),
)

onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <span class="fzm-countup" :class="type ? `is-${type}` : ''" :style="{ fontSize }">
    <span v-if="prefix" class="fzm-countup__prefix">{{ prefix }}</span>
    <span class="fzm-countup__num">{{ format(display) }}</span>
    <span v-if="suffix" class="fzm-countup__suffix">{{ suffix }}</span>
  </span>
</template>

<style scoped>
.fzm-countup {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  font-family: var(--font-mono);
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85), 0 0 16px rgb(var(--primary-rgb) / 0.55);
}

.fzm-countup.is-success {
  color: var(--success);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85), 0 0 16px rgb(var(--success-rgb) / 0.55);
}

.fzm-countup.is-warning {
  color: var(--warning);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85), 0 0 16px rgb(var(--warning-rgb) / 0.55);
}

.fzm-countup.is-danger {
  color: var(--danger);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85), 0 0 16px rgb(var(--danger-rgb) / 0.55);
}

.fzm-countup.is-info {
  color: var(--primary);
}

.fzm-countup__prefix,
.fzm-countup__suffix {
  font-size: 0.55em;
  font-weight: 600;
  opacity: 0.85;
}
</style>
