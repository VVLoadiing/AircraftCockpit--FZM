<script setup lang="ts">
/**
 * TechRadioGroup — 单选组
 *
 * 管理多个 TechRadio 的互斥单选：v-model 绑定 string|number。
 * 通过 provide 把当前值、disabled、切换方法传给子 Radio，子 Radio 自动同步。
 * direction 控制排列方向（horizontal 横向 / vertical 纵向）。
 */
import { provide, computed } from 'vue'
import TechRadio from '../TechRadio/TechRadio.vue'

const props = withDefaults(
  defineProps<{
    /** v-model 绑定值（当前选中项的值） */
    modelValue?: string | number
    /** 快速生成选项（label 为值，text 为显示文字） */
    options?: { label: string | number; text?: string }[]
    /** 禁用整组 */
    disabled?: boolean
    /** 排列方向 */
    direction?: 'horizontal' | 'vertical'
  }>(),
  {
    modelValue: '',
    options: () => [],
    disabled: false,
    direction: 'horizontal',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | number): void
  (e: 'change', val: string | number): void
}>()

const innerVal = computed(() => props.modelValue)

function pick(val: string | number) {
  if (val === props.modelValue) return
  emit('update:modelValue', val)
  emit('change', val)
}

// provide 给子 Radio（传 computed 引用，保证响应式）
provide('techRadioGroup', innerVal)
provide('techRadioGroupDisabled', computed(() => props.disabled))
provide('techRadioGroupChange', pick)
</script>

<template>
  <div class="fzm-radio-group" :class="[`is-${direction}`, { 'is-disabled': disabled }]">
    <TechRadio v-if="options.length" v-for="opt in options" :key="opt.label" :label="opt.label">
      {{ opt.text ?? opt.label }}
    </TechRadio>
    <slot v-else />
  </div>
</template>

<style scoped>
.fzm-radio-group.is-horizontal {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 16px;
}

.fzm-radio-group.is-vertical {
  display: inline-flex;
  flex-direction: column;
  gap: 12px;
}

.fzm-radio-group.is-disabled {
  opacity: 0.5;
}
</style>
