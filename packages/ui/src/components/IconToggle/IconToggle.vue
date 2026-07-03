<script setup lang="ts">
/**
 * IconToggle — 图标按钮组 / 工具栏切换
 * 一组图标按钮，单选模式（v-model 为当前激活值）。
 * 适合视图模式切换、工具栏等场景。
 */
import { computed } from 'vue'

interface ToggleItem {
  /** 唯一标识 */
  value: string | number
  /** 显示文字（可选，与图标二选一或共存） */
  label?: string
  /** 图标（svg 路径或文本） */
  icon?: string
  /** 禁用该项 */
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    /** v-model：当前激活项的 value */
    modelValue?: string | number
    /** 选项列表 */
    items: ToggleItem[]
    /** 禁用整组 */
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number, item: ToggleItem): void
}>()

const activeValue = computed(() => props.modelValue)

function select(item: ToggleItem) {
  if (item.disabled || props.disabled) return
  emit('update:modelValue', item.value)
  emit('change', item.value, item)
}
</script>

<template>
  <div class="fzm-icon-toggle" :class="{ 'is-disabled': disabled }">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      class="fzm-icon-toggle__item"
      :class="{
        'is-active': item.value === activeValue,
        'is-disabled': item.disabled,
      }"
      :title="item.label"
      :disabled="item.disabled || disabled"
      @click="select(item)"
    >
      <svg
        v-if="item.icon"
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        v-html="`<path d='${item.icon}'/>`"
      />
      <span v-if="item.label" class="fzm-icon-toggle__label">{{ item.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.fzm-icon-toggle {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  background: rgb(var(--primary-rgb) / 0.06);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
}

.fzm-icon-toggle.is-disabled {
  opacity: 0.5;
}

.fzm-icon-toggle__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 26px;
  min-width: 26px;
  padding: 0 8px;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.18s ease;
}

.fzm-icon-toggle__item:hover:not(.is-disabled):not(.is-active) {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.fzm-icon-toggle__item.is-active {
  color: var(--text-on-primary);
  background: var(--primary-gradient);
  border-color: var(--primary);
  box-shadow: 0 0 10px rgb(var(--primary-rgb) / 0.4);
}

.fzm-icon-toggle__item.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.fzm-icon-toggle__label {
  letter-spacing: 0.5px;
}
</style>
