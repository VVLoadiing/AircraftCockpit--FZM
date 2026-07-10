<script setup lang="ts">
/**
 * TechRadio — 科技风单选框
 *
 * 两种用法：
 *  1. 独立使用：v-model 绑定 boolean
 *  2. 组内使用：作为 TechRadioGroup 子项，通过 inject 同步，
 *     label 作为该选项的值，选中即将 Group 的值设为 label。
 *
 * 选中态：主题色渐变填充圆心点 + 外辉光。
 */
import { computed, inject, unref } from 'vue'
import type { Ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** v-model 绑定值（独立模式为 boolean） */
    modelValue?: boolean
    /** 该选项的值（组模式下，选中即将 Group 值设为此） */
    label?: string | number
    /** 是否禁用 */
    disabled?: boolean
  }>(),
  {
    modelValue: false,
    label: '',
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'change', val: boolean): void
}>()

/* —— 组模式注入 —— */
const groupModel = inject<Ref<string | number> | null>('techRadioGroup', null)
const groupDisabled = inject<Ref<boolean> | boolean>('techRadioGroupDisabled', false)
const groupChange = inject<(val: string | number) => void>('techRadioGroupChange', () => {})

/** 选中态：组模式下 modelValue === label */
const isChecked = computed(() => {
  if (groupModel) return groupModel.value === props.label
  return props.modelValue
})

const isDisabled = computed(() => props.disabled || Boolean(unref(groupDisabled)))

function pick() {
  if (isDisabled.value || isChecked.value) return
  if (groupModel) {
    groupChange(props.label)
  } else {
    emit('update:modelValue', true)
    emit('change', true)
  }
}
</script>

<template>
  <label class="fzm-radio" :class="{ 'is-disabled': isDisabled, 'is-checked': isChecked }">
    <span class="fzm-radio__box">
      <span class="fzm-radio__dot" />
    </span>
    <input type="radio" class="fzm-radio__input" :checked="isChecked" :disabled="isDisabled" @click="pick" />
    <span v-if="$slots.default || label" class="fzm-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.fzm-radio {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  color: var(--text-primary);
}

.fzm-radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.fzm-radio__box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border: 1px solid var(--border-strong);
  border-radius: 50%;
  background: rgb(var(--primary-rgb) / 0.06);
  /* 只过渡 border-color，不过渡 box-shadow（辉光扩展会撑大视觉边界导致抖动） */
  transition: border-color 0.2s ease;
}

.fzm-radio:hover .fzm-radio__box {
  border-color: var(--primary);
}

/* 选中态：边框主题色 + 外辉光（box-shadow 不过渡，瞬间到位避免撑大抖动） */
.fzm-radio.is-checked .fzm-radio__box {
  border-color: var(--primary);
  box-shadow: 0 0 10px rgb(var(--primary-rgb) / 0.5);
}

/* 选中圆心点：常驻 DOM，默认透明缩小，选中时淡入放大（平滑无闪） */
.fzm-radio__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-gradient);
  box-shadow: 0 0 6px rgb(var(--primary-rgb) / 0.8);
  opacity: 0;
  transform: scale(0.4);
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}

.fzm-radio.is-checked .fzm-radio__dot {
  opacity: 1;
  transform: scale(1);
}

.fzm-radio.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.fzm-radio__label {
  line-height: 1.5;
}
</style>
