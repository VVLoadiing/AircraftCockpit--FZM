<script setup lang="ts">
/**
 * TechRate — 科技风评分
 * SVG 星标 + 主题色辉光。支持半星（allowHalf）、只读、键盘左右调节。
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** v-model 绑定值（当前评分） */
    modelValue?: number
    /** 最大星数 */
    max?: number
    /** 是否允许半星 */
    allowHalf?: boolean
    /** 只读（不可点击） */
    readonly?: boolean
    /** 禁用 */
    disabled?: boolean
  }>(),
  {
    modelValue: 0,
    max: 5,
    allowHalf: false,
    readonly: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void
  (e: 'change', val: number): void
}>()

/** 星标数组 */
const stars = computed(() => Array.from({ length: props.max }, (_, i) => i + 1))

/** 某颗星的填充比例（0 / 0.5 / 1） */
function fillOf(star: number): number {
  const v = props.modelValue
  if (v >= star) return 1
  if (props.allowHalf && v >= star - 0.5) return 0.5
  return 0
}

/** 点击：依据鼠标在星内的位置决定整星/半星 */
function onStar(star: number, e: MouseEvent) {
  if (props.readonly || props.disabled) return
  let val = star
  if (props.allowHalf) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const isLeft = e.clientX - rect.left < rect.width / 2
    val = isLeft ? star - 0.5 : star
  }
  if (val === props.modelValue) return
  emit('update:modelValue', val)
  emit('change', val)
}

function onKeydown(e: KeyboardEvent) {
  if (props.readonly || props.disabled) return
  const step = props.allowHalf ? 0.5 : 1
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    e.preventDefault()
    const next = Math.min(props.max, props.modelValue + step)
    emit('update:modelValue', next)
    emit('change', next)
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    e.preventDefault()
    const next = Math.max(0, props.modelValue - step)
    emit('update:modelValue', next)
    emit('change', next)
  }
}
</script>

<template>
  <div
    class="fzm-rate"
    :class="{ 'is-readonly': readonly, 'is-disabled': disabled }"
    role="slider"
    :aria-valuenow="modelValue"
    :aria-valuemin="0"
    :aria-valuemax="max"
    tabindex="0"
    @keydown="onKeydown"
  >
    <span
      v-for="star in stars"
      :key="star"
      class="fzm-rate__star"
      :class="{ 'is-active': fillOf(star) > 0 }"
      @click="onStar(star, $event)"
    >
      <!-- 底层灰星 -->
      <svg class="fzm-rate__icon fzm-rate__icon--bg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <!-- 填充层（主题色，按 fill 比例裁切） -->
      <span class="fzm-rate__fill" :style="{ width: fillOf(star) * 100 + '%' }">
        <svg class="fzm-rate__icon fzm-rate__icon--fg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </span>
    </span>
    <span v-if="modelValue > 0" class="fzm-rate__value">{{ modelValue }}</span>
  </div>
</template>

<style scoped>
.fzm-rate {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  outline: none;
}

.fzm-rate__star {
  position: relative;
  display: inline-block;
  width: 18px;
  height: 18px;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.fzm-rate:not(.is-readonly):not(.is-disabled) .fzm-rate__star:hover {
  transform: scale(1.2);
}

.fzm-rate__icon {
  position: absolute;
  inset: 0;
  width: 18px;
  height: 18px;
}

/* 底层灰星 */
.fzm-rate__icon--bg {
  color: rgb(var(--primary-rgb) / 0.22);
}

/* 填充层：主题色，按比例裁切宽度 */
.fzm-rate__fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.fzm-rate__icon--fg {
  color: var(--primary);
  filter: drop-shadow(0 0 4px rgb(var(--primary-rgb) / 0.7));
}

.fzm-rate__value {
  margin-left: 6px;
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--primary-lighter);
  text-shadow: 0 0 8px rgb(var(--primary-rgb) / 0.4);
}

.fzm-rate.is-readonly .fzm-rate__star,
.fzm-rate.is-disabled .fzm-rate__star {
  cursor: default;
}

.fzm-rate.is-disabled {
  opacity: 0.45;
}
</style>
