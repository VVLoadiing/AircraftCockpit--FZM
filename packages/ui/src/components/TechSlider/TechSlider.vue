<script setup lang="ts">
/**
 * TechSlider — 科技风滑块
 * 主题色渐变轨道 + 辉光滑块。基于原生 input[type=range] 封装，
 * 支持自定义样式、min/max/step、禁用、数值显示。
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** v-model 绑定值 */
    modelValue?: number
    /** 最小值 */
    min?: number
    /** 最大值 */
    max?: number
    /** 步长 */
    step?: number
    /** 禁用 */
    disabled?: boolean
    /** 是否显示当前数值 */
    showValue?: boolean
  }>(),
  {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    showValue: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void
  (e: 'change', val: number): void
}>()

/** 已选轨道占比（0~100%），驱动渐变填充 */
const percent = computed(() => {
  const range = props.max - props.min
  if (range <= 0) return 0
  return ((props.modelValue - props.min) / range) * 100
})

function onInput(e: Event) {
  const v = Number((e.target as HTMLInputElement).value)
  emit('update:modelValue', v)
}

function onChange(e: Event) {
  emit('change', Number((e.target as HTMLInputElement).value))
}
</script>

<template>
  <div class="fzm-slider" :class="{ 'is-disabled': disabled }">
    <div class="fzm-slider__track-wrap">
      <!-- 底层轨道 -->
      <div class="fzm-slider__track" />
      <!-- 已选填充（主题色渐变） -->
      <div class="fzm-slider__fill" :style="{ width: percent + '%' }" />
      <!-- 滑块（用 input 原生拖拽，视觉用伪元素） -->
      <input
        type="range"
        class="fzm-slider__input"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :style="{ '--percent': percent + '%' }"
        @input="onInput"
        @change="onChange"
      />
    </div>
    <span v-if="showValue" class="fzm-slider__value">{{ modelValue }}</span>
  </div>
</template>

<style scoped>
.fzm-slider {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.fzm-slider__track-wrap {
  position: relative;
  flex: 1;
  height: 20px;
  display: flex;
  align-items: center;
}

/* 底层轨道 */
.fzm-slider__track {
  position: absolute;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 2px;
  background: rgb(var(--primary-rgb) / 0.18);
}

/* 已选填充（主题色渐变） */
.fzm-slider__fill {
  position: absolute;
  left: 0;
  height: 4px;
  border-radius: 2px;
  background: var(--primary-gradient);
  box-shadow: 0 0 8px rgb(var(--primary-rgb) / 0.5);
  pointer-events: none;
}

/* 原生 input 透明覆盖，负责交互 */
.fzm-slider__input {
  position: relative;
  width: 100%;
  height: 20px;
  margin: 0;
  background: transparent;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

/* 隐藏原生轨道 */
.fzm-slider__input::-webkit-slider-runnable-track {
  background: transparent;
  height: 4px;
}
.fzm-slider__input::-moz-range-track {
  background: transparent;
  height: 4px;
}

/* 滑块（webkit） */
.fzm-slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--primary);
  box-shadow: 0 0 8px rgb(var(--primary-rgb) / 0.7), 0 1px 3px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  margin-top: -5px; /* 居中于 4px 轨道 */
}
.fzm-slider__input:hover::-webkit-slider-thumb {
  transform: scale(1.15);
  box-shadow: 0 0 12px rgb(var(--primary-rgb) / 0.9), 0 1px 3px rgba(0, 0, 0, 0.4);
}

/* 滑块（firefox） */
.fzm-slider__input::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--primary);
  box-shadow: 0 0 8px rgb(var(--primary-rgb) / 0.7);
  cursor: pointer;
}

.fzm-slider__value {
  min-width: 32px;
  text-align: right;
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--primary-lighter);
  text-shadow: 0 0 8px rgb(var(--primary-rgb) / 0.4);
}

.fzm-slider.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.fzm-slider.is-disabled .fzm-slider__input {
  cursor: not-allowed;
}
</style>
