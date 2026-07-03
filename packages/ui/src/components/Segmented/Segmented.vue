<script setup lang="ts">
/**
 * Segmented — 分段控制器（机甲风 radio 组）
 * 凹槽容器 + 激活段主题色凸起 + 辉光。适合少量互斥选项的紧凑切换。
 */
import { computed } from 'vue'

interface SegItem {
  value: string | number
  label: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    /** v-model：当前激活值 */
    modelValue?: string | number
    /** 选项 */
    items: SegItem[]
    /** 禁用整组 */
    disabled?: boolean
    /** 是否撑满父容器宽度 */
    block?: boolean
  }>(),
  {
    modelValue: '',
    disabled: false,
    block: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number, item: SegItem): void
}>()

const activeValue = computed(() => props.modelValue)

function select(item: SegItem) {
  if (item.disabled || props.disabled) return
  emit('update:modelValue', item.value)
  emit('change', item.value, item)
}
</script>

<template>
  <div class="fzm-segmented" :class="{ 'is-disabled': disabled, 'is-block': block }">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      class="fzm-segmented__item"
      :class="{
        'is-active': item.value === activeValue,
        'is-disabled': item.disabled,
      }"
      :disabled="item.disabled || disabled"
      @click="select(item)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<style scoped>
.fzm-segmented {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  background: rgb(var(--primary-rgb) / 0.1);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
}

.fzm-segmented.is-block {
  display: flex;
  width: 100%;
}

.fzm-segmented.is-block .fzm-segmented__item {
  flex: 1;
}

.fzm-segmented.is-disabled {
  opacity: 0.5;
}

.fzm-segmented__item {
  padding: 6px 14px;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.18s ease;
  white-space: nowrap;
}

.fzm-segmented__item:hover:not(.is-disabled):not(.is-active) {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.fzm-segmented__item.is-active {
  color: var(--text-on-primary);
  background: var(--primary-gradient);
  border-color: var(--primary);
  box-shadow: 0 2px 8px rgb(var(--primary-rgb) / 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.fzm-segmented__item.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
