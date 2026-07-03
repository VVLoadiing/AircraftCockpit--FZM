<script setup lang="ts">
/**
 * TechInput — 科技风输入框
 * 切角 + 主题色聚焦辉光 + 可选前缀/后缀插槽（图标、单位）。
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** v-model 绑定值 */
    modelValue?: string | number
    /** 占位符 */
    placeholder?: string
    /** 原生 type */
    type?: string
    /** 禁用 */
    disabled?: boolean
    /** 只读 */
    readonly?: boolean
    /** 是否可清空 */
    clearable?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: '',
    type: 'text',
    disabled: false,
    readonly: false,
    clearable: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'input', value: string): void
  (e: 'change', value: string): void
  (e: 'clear'): void
}>()

const innerVal = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v === null || v === undefined ? '' : String(v)),
})

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  innerVal.value = v
  emit('input', v)
}

function onChange(e: Event) {
  emit('change', (e.target as HTMLInputElement).value)
}

function clear() {
  innerVal.value = ''
  emit('clear')
}
</script>

<template>
  <div class="fzm-input" :class="{ 'is-disabled': disabled, 'is-readonly': readonly }">
    <span v-if="$slots.prefix" class="fzm-input__prefix">
      <slot name="prefix" />
    </span>
    <input
      :type="type"
      :value="innerVal"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      class="fzm-input__inner"
      @input="onInput"
      @change="onChange"
    />
    <span v-if="clearable && innerVal && !disabled && !readonly" class="fzm-input__clear" @click="clear">
      <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </span>
    <span v-if="$slots.suffix" class="fzm-input__suffix">
      <slot name="suffix" />
    </span>
  </div>
</template>

<style scoped>
.fzm-input {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 0 10px;
  height: 32px;
  background: rgb(var(--primary-rgb) / 0.06);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  /* 左上+右下切角 */
  clip-path: polygon(
    var(--notch) 0,
    100% 0,
    100% calc(100% - var(--notch)),
    calc(100% - var(--notch)) 100%,
    0 100%,
    0 var(--notch)
  );
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.fzm-input:hover:not(.is-disabled) {
  border-color: rgb(var(--primary-rgb) / 0.6);
}

.fzm-input:focus-within {
  border-color: var(--primary);
  background: rgb(var(--primary-rgb) / 0.1);
  box-shadow: 0 0 0 1px rgb(var(--primary-rgb) / 0.4), 0 0 14px rgb(var(--primary-rgb) / 0.25);
}

.fzm-input.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fzm-input__inner {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 12px;
  font-family: var(--font-mono);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.fzm-input__inner::placeholder {
  color: var(--text-muted);
  opacity: 0.5;
  text-shadow: none;
}

.fzm-input__inner:disabled {
  cursor: not-allowed;
}

.fzm-input__prefix,
.fzm-input__suffix {
  display: inline-flex;
  align-items: center;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.fzm-input__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  color: var(--text-muted);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.fzm-input__clear:hover {
  color: #fff;
  background: rgb(var(--danger-rgb) / 0.5);
}
</style>
