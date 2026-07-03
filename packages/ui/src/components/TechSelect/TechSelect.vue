<script setup lang="ts">
/**
 * TechSelect — 切角下拉选择
 * 切角触发器 + 浮层选项列表（机甲风玻璃底）。支持 v-model、禁用项、键盘 ESC 关闭。
 */
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    /** v-model 绑定值 */
    modelValue?: string | number
    /** 选项列表 */
    options: SelectOption[]
    /** 占位符 */
    placeholder?: string
    /** 禁用整个选择器 */
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: '请选择',
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number, option: SelectOption): void
}>()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => {
  const hit = props.options.find((o) => o.value === props.modelValue)
  return hit ? hit.label : ''
})

function toggle() {
  if (props.disabled) return
  open.value = !open.value
}

function pick(opt: SelectOption) {
  if (opt.disabled) return
  emit('update:modelValue', opt.value)
  emit('change', opt.value, opt)
  open.value = false
}

function onDocClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})

watch(open, (v) => {
  if (v && selectedLabel.value) {
    // 打开时滚动到选中项（下一帧）
    requestAnimationFrame(() => {
      const el = rootRef.value?.querySelector('.fzm-select__option.is-selected')
      el?.scrollIntoView({ block: 'nearest' })
    })
  }
})
</script>

<template>
  <div ref="rootRef" class="fzm-select" :class="{ 'is-disabled': disabled, 'is-open': open }">
    <!-- 触发器 -->
    <button type="button" class="fzm-select__trigger" :disabled="disabled" @click="toggle">
      <span class="fzm-select__value" :class="{ 'is-placeholder': !selectedLabel }">
        {{ selectedLabel || placeholder }}
      </span>
      <svg
        class="fzm-select__arrow"
        viewBox="0 0 24 24"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>

    <!-- 浮层选项 -->
    <transition name="fzm-select-fade">
      <ul v-if="open" class="fzm-select__dropdown">
        <li
          v-for="opt in options"
          :key="opt.value"
          class="fzm-select__option"
          :class="{ 'is-selected': opt.value === modelValue, 'is-disabled': opt.disabled }"
          @click="pick(opt)"
        >
          <span class="fzm-select__option-label">{{ opt.label }}</span>
          <svg
            v-if="opt.value === modelValue"
            class="fzm-select__check"
            viewBox="0 0 24 24"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12l5 5L20 7" />
          </svg>
        </li>
        <li v-if="options.length === 0" class="fzm-select__empty">无数据</li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.fzm-select {
  position: relative;
  display: inline-block;
  width: 100%;
}

.fzm-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  height: 32px;
  padding: 0 10px;
  color: var(--text-primary);
  background: rgb(var(--primary-rgb) / 0.06);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  clip-path: polygon(
    var(--notch) 0,
    100% 0,
    100% calc(100% - var(--notch)),
    calc(100% - var(--notch)) 100%,
    0 100%,
    0 var(--notch)
  );
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.fzm-select__trigger:hover:not(:disabled) {
  border-color: rgb(var(--primary-rgb) / 0.6);
}

.fzm-select.is-open .fzm-select__trigger {
  border-color: var(--primary);
  box-shadow: 0 0 0 1px rgb(var(--primary-rgb) / 0.4), 0 0 14px rgb(var(--primary-rgb) / 0.25);
}

.fzm-select__trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fzm-select__value {
  flex: 1;
  min-width: 0;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-mono);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.fzm-select__value.is-placeholder {
  color: var(--text-muted);
  opacity: 0.5;
  font-family: var(--font-sans);
  text-shadow: none;
}

.fzm-select__arrow {
  color: var(--text-secondary);
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.fzm-select.is-open .fzm-select__arrow {
  transform: rotate(180deg);
}

/* —— 浮层 —— */
.fzm-select__dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 50;
  margin: 0;
  padding: 4px;
  list-style: none;
  max-height: 220px;
  overflow-y: auto;
  background: var(--glass-bg-strong);
  backdrop-filter: var(--glass-blur-strong);
  -webkit-backdrop-filter: var(--glass-blur-strong);
  border: var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--glass-shadow);
}

.fzm-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
  font-size: 12px;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;
}

.fzm-select__option:hover:not(.is-disabled) {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.fzm-select__option.is-selected {
  color: var(--primary-lighter);
  background: rgb(var(--primary-rgb) / 0.16);
}

.fzm-select__option.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.fzm-select__check {
  color: var(--primary);
  flex-shrink: 0;
}

.fzm-select__empty {
  padding: 12px;
  text-align: center;
  font-size: 11px;
  color: var(--text-muted);
  opacity: 0.6;
}

/* 浮层过渡 */
.fzm-select-fade-enter-active,
.fzm-select-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.fzm-select-fade-enter-from,
.fzm-select-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
