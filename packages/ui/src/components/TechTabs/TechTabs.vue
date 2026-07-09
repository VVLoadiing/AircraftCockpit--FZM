<script setup lang="ts">
/**
 * TechTabs — 标签页切换
 * 科技横幅条风格的标签头 + 激活指示条。配合默认插槽渲染当前面板。
 */
import { computed, ref, nextTick, onMounted, watch } from 'vue'

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

const headerRef = ref<HTMLElement>()
const indicatorStyle = ref({ width: '0px', left: '0px' })

const activeValue = computed(() => props.modelValue)
const activeItem = computed(() => props.items.find((t) => t.value === activeValue.value))
const activeIndex = computed(() => props.items.findIndex((t) => t.value === props.modelValue))

function updateIndicatorPosition() {
  if (!headerRef.value) return
  const items = headerRef.value.querySelectorAll('.fzm-tabs__item')
  const activeTab = items[activeIndex.value] as HTMLElement
  if (!activeTab) return

  indicatorStyle.value = {
    width: `${activeTab.offsetWidth - 16}px`,
    left: `${activeTab.offsetLeft + 8}px`,
  }
}

function select(item: TabItem) {
  if (item.disabled) return
  emit('update:modelValue', item.value)
  emit('change', item.value, item)
}

watch(activeValue, () => {
  nextTick(updateIndicatorPosition)
})

watch(
  () => props.items,
  () => {
    nextTick(updateIndicatorPosition)
  },
  { deep: true },
)

onMounted(() => {
  nextTick(updateIndicatorPosition)
})
</script>

<template>
  <div class="fzm-tabs">
    <!-- 标签头 -->
    <div ref="headerRef" class="fzm-tabs__header">
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
      <!-- 滑动指示条 -->
      <div class="fzm-tabs__indicator" :style="indicatorStyle"></div>
    </div>

    <!-- 面板：可用默认插槽自定义，也可用 #panel(item) 具名插槽 -->
    <div class="fzm-tabs__panel">
      <Transition name="fzm-tabs-fade" mode="out-in">
        <div :key="activeValue">
          <slot :item="activeItem" :value="activeValue">
            <slot :name="`panel-${activeValue}`" />
          </slot>
        </div>
      </Transition>
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
  position: relative;
  display: flex;
  align-items: center;
  gap: 2px;
  padding-bottom: 1px;
  border-bottom: 1px solid var(--border-light);
}

.fzm-tabs__item {
  position: relative;
  z-index: 1;
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

/* 滑动指示条 */
.fzm-tabs__indicator {
  position: absolute;
  bottom: -1px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  box-shadow: 0 0 8px rgb(var(--primary-rgb) / 0.8);
  transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.fzm-tabs__panel {
  min-height: 0;
  overflow: hidden;
}

/* 面板切换动画 */
.fzm-tabs-fade-enter-active,
.fzm-tabs-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fzm-tabs-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fzm-tabs-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
