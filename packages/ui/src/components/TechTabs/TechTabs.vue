<script setup lang="ts">
/**
 * TechTabs — 标签页切换
 * 科技横幅条风格的标签头 + 激活指示条。配合默认插槽渲染当前面板。
 */
import { computed } from 'vue'

interface TabItem {
  /** 唯一标识 */
  value: string | number
  /** 标签文字 */
  label: string
  /** 禁用 */
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    /** v-model：当前激活标签 value */
    modelValue?: string | number
    /** 标签列表 */
    items: TabItem[]
  }>(),
  {
    modelValue: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number, item: TabItem): void
}>()

const activeValue = computed(() => props.modelValue)
const activeItem = computed(() => props.items.find((t) => t.value === activeValue.value))

function select(item: TabItem) {
  if (item.disabled) return
  emit('update:modelValue', item.value)
  emit('change', item.value, item)
}
</script>

<template>
  <div class="fzm-tabs">
    <!-- 标签头 -->
    <div class="fzm-tabs__header">
      <button
        v-for="item in items"
        :key="item.value"
        type="button"
        class="fzm-tabs__item"
        :class="{ 'is-active': item.value === activeValue, 'is-disabled': item.disabled }"
        :disabled="item.disabled"
        @click="select(item)"
      >
        <span class="fzm-tabs__label">{{ item.label }}</span>
      </button>
    </div>

    <!-- 面板：可用默认插槽自定义，也可用 #panel(item) 具名插槽 -->
    <div class="fzm-tabs__panel">
      <slot :item="activeItem" :value="activeValue">
        <slot :name="`panel-${activeValue}`" />
      </slot>
    </div>
  </div>
</template>

<style scoped>
.fzm-tabs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.fzm-tabs__header {
  display: flex;
  align-items: center;
  gap: 2px;
  padding-bottom: 1px;
  border-bottom: 1px solid var(--border-light);
}

.fzm-tabs__item {
  position: relative;
  padding: 8px 14px;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: color 0.2s ease;
}

.fzm-tabs__item:hover:not(.is-disabled):not(.is-active) {
  color: var(--text-primary);
}

.fzm-tabs__item.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.fzm-tabs__item.is-active {
  color: var(--text-primary);
  text-shadow: 0 0 10px rgb(var(--primary-rgb) / 0.5);
}

/* 激活指示条：底部主题色光柱 + 辉光 */
.fzm-tabs__item.is-active::after {
  content: '';
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: -1px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  box-shadow: 0 0 8px rgb(var(--primary-rgb) / 0.8);
}

.fzm-tabs__panel {
  min-height: 0;
}
</style>
