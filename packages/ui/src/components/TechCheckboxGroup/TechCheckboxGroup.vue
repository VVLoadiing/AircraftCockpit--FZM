<script setup lang="ts">
/**
 * TechCheckboxGroup — 复选框组
 *
 * 管理多个 TechCheckbox 的多选：v-model 绑定 string[]|number[]。
 * 通过 provide 把当前值数组、disabled、切换方法传给子 Checkbox，
 * 子 Checkbox 自动同步选中态，无需手动绑定每个项。
 *
 * 也可用 options prop 快速生成选项（不必手写子 Checkbox）。
 */
import { provide, computed } from 'vue'
import TechCheckbox from '../TechCheckbox/TechCheckbox.vue'

const props = withDefaults(
  defineProps<{
    /** v-model 绑定值（选中项的值数组） */
    modelValue?: (string | number)[]
    /** 快速生成选项（label 为选项值，text 为显示文字） */
    options?: { label: string | number; text?: string }[]
    /** 禁用整组 */
    disabled?: boolean
  }>(),
  {
    modelValue: () => [],
    options: () => [],
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: (string | number)[]): void
  (e: 'change', val: (string | number)[]): void
}>()

const innerVal = computed(() => props.modelValue)

/** 子 Checkbox 点击：把值加入或移出数组 */
function toggleItem(val: string | number) {
  const arr = [...props.modelValue]
  const idx = arr.indexOf(val)
  if (idx === -1) {
    arr.push(val)
  } else {
    arr.splice(idx, 1)
  }
  emit('update:modelValue', arr)
  emit('change', arr)
}

// provide 给子 Checkbox（传 computed 引用，保证响应式）
provide('techCheckboxGroup', innerVal)
provide('techCheckboxGroupDisabled', computed(() => props.disabled))
provide('techCheckboxGroupChange', toggleItem)
</script>

<template>
  <div class="fzm-checkbox-group" :class="{ 'is-disabled': disabled }">
    <!-- options 模式：自动生成子 Checkbox -->
    <TechCheckbox v-if="options.length" v-for="opt in options" :key="opt.label" :label="opt.label">
      {{ opt.text ?? opt.label }}
    </TechCheckbox>
    <!-- 插槽模式：手写子 Checkbox -->
    <slot v-else />
  </div>
</template>

<style scoped>
.fzm-checkbox-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 16px;
}

.fzm-checkbox-group.is-disabled {
  opacity: 0.5;
}
</style>
