<script setup lang="ts">
/**
 * TechSwitch — 开关
 * 切角轨道 + 滑块 + 开启时主题色辉光。
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** v-model 绑定值 */
    modelValue?: boolean
    /** 禁用 */
    disabled?: boolean
    /** 尺寸 */
    size?: 'normal' | 'small'
  }>(),
  {
    modelValue: false,
    disabled: false,
    size: 'normal',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const checked = computed(() => props.modelValue)

function toggle() {
  if (props.disabled) return
  const v = !checked.value
  emit('update:modelValue', v)
  emit('change', v)
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="checked"
    class="fzm-switch"
    :class="[`is-${size}`, { 'is-checked': checked, 'is-disabled': disabled }]"
    :disabled="disabled"
    @click="toggle"
  >
    <span class="fzm-switch__thumb" />
  </button>
</template>

<style scoped>
.fzm-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 20px;
  padding: 0;
  border: 1px solid var(--border-color);
  background: rgb(255 255 255 / 0.08);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: var(--radius-sm);
  /* 左上+右下切角 */
  clip-path: polygon(
    4px 0,
    100% 0,
    100% calc(100% - 4px),
    calc(100% - 4px) 100%,
    0 100%,
    0 4px
  );
  cursor: pointer;
  transition: all 0.25s ease;
}

.fzm-switch.is-small {
  width: 32px;
  height: 16px;
}

.fzm-switch.is-checked {
  background: var(--primary-gradient);
  border-color: var(--primary);
  box-shadow: 0 0 12px rgb(var(--primary-rgb) / 0.5);
}

.fzm-switch.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.fzm-switch__thumb {
  position: absolute;
  top: 50%;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 2px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  transform: translateY(-50%);
  transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1), background 0.25s ease;
}

.fzm-switch.is-small .fzm-switch__thumb {
  width: 10px;
  height: 10px;
}

.fzm-switch.is-checked .fzm-switch__thumb {
  left: calc(100% - 16px);
  background: var(--text-on-primary);
}

.fzm-switch.is-small.is-checked .fzm-switch__thumb {
  left: calc(100% - 12px);
}
</style>
