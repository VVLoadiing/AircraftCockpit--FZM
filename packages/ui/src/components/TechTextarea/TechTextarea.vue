<script setup lang="ts">
/**
 * TechTextarea — 科技风多行输入框
 * 与 TechInput 同风格：切角 + 主题色聚焦辉光 + 微透底。
 * 支持 rows 行数、maxlength 字数限制、showCount 字数统计。
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** v-model 绑定值 */
    modelValue?: string
    /** 占位符 */
    placeholder?: string
    /** 行数 */
    rows?: number
    /** 禁用 */
    disabled?: boolean
    /** 只读 */
    readonly?: boolean
    /** 最大字数 */
    maxlength?: number
    /** 是否显示字数统计 */
    showCount?: boolean
    /** 是否可调整大小 */
    resizable?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: '',
    rows: 4,
    disabled: false,
    readonly: false,
    showCount: false,
    resizable: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
  (e: 'input', val: string): void
  (e: 'change', val: string): void
}>()

const innerVal = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v ?? ''),
})

function onInput(e: Event) {
  const v = (e.target as HTMLTextAreaElement).value
  emit('input', v)
}

function onChange(e: Event) {
  emit('change', (e.target as HTMLTextAreaElement).value)
}

const count = computed(() => props.modelValue.length)
</script>

<template>
  <div class="fzm-textarea" :class="{ 'is-disabled': disabled, 'is-readonly': readonly }">
    <textarea
      v-model="innerVal"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      class="fzm-textarea__inner"
      :style="{ resize: resizable ? 'vertical' : 'none' }"
      @input="onInput"
      @change="onChange"
    />
    <span v-if="showCount" class="fzm-textarea__count">
      {{ count }}<span v-if="maxlength">/{{ maxlength }}</span>
    </span>
  </div>
</template>

<style scoped>
.fzm-textarea {
  position: relative;
  display: inline-block;
  width: 100%;
  background: rgb(var(--primary-rgb) / 0.06);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  /* 左上+右下对角切角（与 TechInput 一致） */
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

.fzm-textarea:hover {
  border-color: rgb(var(--primary-rgb) / 0.6);
}

/* 聚焦：主题色边 + 标准辉光 */
.fzm-textarea:focus-within {
  border-color: var(--primary);
  background: rgb(var(--primary-rgb) / 0.1);
  box-shadow: 0 0 0 1px rgb(var(--primary-rgb) / 0.4), 0 0 14px rgb(var(--primary-rgb) / 0.25);
}

.fzm-textarea__inner {
  display: block;
  width: 100%;
  padding: 9px 11px;
  font-size: 12px;
  font-family: var(--font-mono);
  line-height: 1.6;
  color: var(--text-primary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  background: transparent;
  border: none;
  outline: none;
  resize: none;
}

.fzm-textarea__inner::placeholder {
  color: var(--text-muted);
  opacity: 0.5;
  text-shadow: none;
}

.fzm-textarea__count {
  position: absolute;
  right: 10px;
  bottom: 6px;
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--text-muted);
  opacity: 0.6;
  pointer-events: none;
}

.fzm-textarea.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fzm-textarea.is-readonly .fzm-textarea__inner {
  cursor: default;
}
</style>
