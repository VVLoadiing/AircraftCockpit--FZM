<script setup lang="ts">
/**
 * TechCheckbox — 科技风复选框
 *
 * 两种用法：
 *  1. 独立使用：v-model 绑定 boolean
 *  2. 组内使用：作为 TechCheckboxGroup 子项，v-model 绑定到 Group，
 *     本组件通过 inject 自动同步选中态，label 作为该选项的值。
 *
 * 选中态：主题色渐变填充 + 对勾 + 外辉光；半选 indeterminate 显示横线。
 */
import { computed, inject, unref } from 'vue'
import type { Ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** v-model 绑定值（独立模式为 boolean） */
    modelValue?: boolean
    /** 该选项的值（组模式下，选中即把此值加入 Group 的数组） */
    label?: string | number
    /** 是否禁用 */
    disabled?: boolean
    /** 半选态（全选场景的中间状态，仅视觉，不影响值） */
    indeterminate?: boolean
  }>(),
  {
    modelValue: false,
    label: '',
    disabled: false,
    indeterminate: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'change', val: boolean): void
}>()

/* —— 组模式：从 Group 注入当前值数组 + 切换方法 —— */
const groupModel = inject<Ref<(string | number)[]> | null>('techCheckboxGroup', null)
const groupDisabled = inject<Ref<boolean> | boolean>('techCheckboxGroupDisabled', false)
const groupChange = inject<(val: string | number) => void>('techCheckboxGroupChange', () => {})

/** 实际选中态：组模式下由数组是否包含 label 决定，否则用 modelValue */
const isChecked = computed(() => {
  if (groupModel) {
    const arr = groupModel.value
    return props.label !== '' && arr.includes(props.label)
  }
  return props.modelValue
})

const isDisabled = computed(() => props.disabled || Boolean(unref(groupDisabled)))

function toggle() {
  if (isDisabled.value) return
  if (groupModel) {
    groupChange(props.label)
  } else {
    const next = !props.modelValue
    emit('update:modelValue', next)
    emit('change', next)
  }
}
</script>

<template>
  <label class="fzm-checkbox" :class="{ 'is-disabled': isDisabled, 'is-checked': isChecked, 'is-indeterminate': indeterminate }">
    <span class="fzm-checkbox__box">
      <!-- 对勾（常驻，选中时淡入放大；半选时隐藏） -->
      <svg class="fzm-checkbox__icon" :class="{ 'is-show': isChecked && !indeterminate }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
      <!-- 半选横线（常驻，indeterminate 时显示） -->
      <span class="fzm-checkbox__dash" :class="{ 'is-show': indeterminate }" />
    </span>
    <input type="checkbox" class="fzm-checkbox__input" :checked="isChecked" :disabled="isDisabled" @click="toggle" />
    <span v-if="$slots.default || label" class="fzm-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.fzm-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  color: var(--text-primary);
}

/* 隐藏原生 input，仅保留语义与可访问性 */
.fzm-checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* 复选框盒子 */
.fzm-checkbox__box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: rgb(var(--primary-rgb) / 0.06);
  /* 只过渡 border-color/background，不过渡 box-shadow（避免辉光撑大抖动） */
  transition: border-color 0.2s ease, background 0.2s ease;
}

.fzm-checkbox:hover .fzm-checkbox__box {
  border-color: var(--primary);
}

/* 选中态：主题色渐变填充 + 外辉光（box-shadow 不过渡，瞬间到位） */
.fzm-checkbox.is-checked .fzm-checkbox__box {
  background: var(--primary-gradient);
  border-color: var(--primary);
  box-shadow: 0 0 10px rgb(var(--primary-rgb) / 0.5);
}

/* 对勾：常驻，默认隐藏，选中时淡入放大 */
.fzm-checkbox__icon {
  position: absolute;
  width: 11px;
  height: 11px;
  color: var(--text-on-primary);
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 0.15s ease, transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
.fzm-checkbox__icon.is-show {
  opacity: 1;
  transform: scale(1);
}

/* 半选横线：常驻，默认隐藏，indeterminate 时显示 */
.fzm-checkbox__dash {
  position: absolute;
  width: 9px;
  height: 2px;
  background: var(--text-on-primary);
  border-radius: 1px;
  opacity: 0;
  transform: scaleX(0.5);
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fzm-checkbox__dash.is-show {
  opacity: 1;
  transform: scaleX(1);
}
.fzm-checkbox.is-indeterminate .fzm-checkbox__box {
  background: var(--primary-gradient);
  border-color: var(--primary);
  box-shadow: 0 0 10px rgb(var(--primary-rgb) / 0.5);
}

.fzm-checkbox.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.fzm-checkbox__label {
  line-height: 1.5;
}
</style>
