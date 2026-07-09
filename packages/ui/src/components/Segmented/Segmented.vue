<script setup lang="ts">
/**
 * Segmented — 分段控制器（机甲风 radio 组）
 * 凹槽容器 + 激活段主题色凸起 + 辉光。适合少量互斥选项的紧凑切换。
 */
import { computed, ref, nextTick, onMounted, watch } from 'vue'

interface SegItem {
  /** 选项值（v-model 绑定值） */
  value: string | number
  /** 显示文字 */
  label: string
  /** 是否禁用 */
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

const containerRef = ref<HTMLElement>()
const sliderStyle = ref({ width: '0px', transform: 'translateX(0px)' })

const activeValue = computed(() => props.modelValue)
const activeIndex = computed(() => props.items.findIndex((item) => item.value === props.modelValue))

function updateSliderPosition() {
  if (!containerRef.value) return
  const items = containerRef.value.querySelectorAll('.fzm-segmented__item')
  const activeItem = items[activeIndex.value] as HTMLElement
  if (!activeItem) return

  sliderStyle.value = {
    width: `${activeItem.offsetWidth}px`,
    transform: `translateX(${activeItem.offsetLeft - 3}px)`,
  }
}

function select(item: SegItem) {
  if (item.disabled || props.disabled) return
  emit('update:modelValue', item.value)
  emit('change', item.value, item)
}

watch(activeValue, () => {
  nextTick(updateSliderPosition)
})

watch(
  () => props.items,
  () => {
    nextTick(updateSliderPosition)
  },
  { deep: true },
)

onMounted(() => {
  nextTick(updateSliderPosition)
})
</script>

<template>
  <div ref="containerRef" class="fzm-segmented" :class="{ 'is-disabled': disabled, 'is-block': block }">
    <div class="fzm-segmented__slider" :style="sliderStyle"></div>
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
  position: relative;
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

.fzm-segmented__slider {
  position: absolute;
  top: 3px;
  left: 0;
  height: calc(100% - 6px);
  background: var(--primary-gradient);
  border: 1px solid var(--primary);
  border-radius: var(--radius-sm);
  box-shadow: 0 2px 8px rgb(var(--primary-rgb) / 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 0;
}

.fzm-segmented__item {
  position: relative;
  z-index: 1;
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
  transition: color 0.18s ease;
  white-space: nowrap;
}

.fzm-segmented__item:hover:not(.is-disabled):not(.is-active) {
  color: var(--text-primary);
}

.fzm-segmented__item.is-active {
  color: var(--text-on-primary);
}

.fzm-segmented__item.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
