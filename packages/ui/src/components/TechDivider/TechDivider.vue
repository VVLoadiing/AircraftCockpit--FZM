<script setup lang="ts">
/**
 * TechDivider — 分割线
 * 主题色渐变线 + 可选文字/标签（居中显示）。
 */
withDefaults(
  defineProps<{
    /** 分隔方向 */
    direction?: 'horizontal' | 'vertical'
    /** 文字对齐（水平时生效） */
    align?: 'left' | 'center' | 'right'
  }>(),
  {
    direction: 'horizontal',
    align: 'center',
  },
)
</script>

<template>
  <div
    v-if="direction === 'horizontal'"
    class="fzm-divider fzm-divider--horizontal"
    :class="`is-${align}`"
  >
    <span v-if="$slots.default" class="fzm-divider__text">
      <slot />
    </span>
  </div>
  <span v-else class="fzm-divider fzm-divider--vertical" />
</template>

<style scoped>
/* —— 水平 —— */
.fzm-divider--horizontal {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 12px 0;
}

.fzm-divider--horizontal::before,
.fzm-divider--horizontal::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgb(var(--primary-rgb) / 0.4), transparent);
}

.fzm-divider__text {
  padding: 0 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--text-secondary);
  white-space: nowrap;
  text-shadow: 0 0 8px rgb(var(--primary-rgb) / 0.3);
}

.fzm-divider--horizontal.is-left::before {
  max-width: 40px;
}

.fzm-divider--horizontal.is-right::after {
  max-width: 40px;
}

.fzm-divider--horizontal.is-left {
  justify-content: flex-start;
}

.fzm-divider--horizontal.is-right {
  justify-content: flex-end;
}

/* —— 垂直 —— */
.fzm-divider--vertical {
  display: inline-block;
  width: 1px;
  height: 1em;
  margin: 0 8px;
  vertical-align: middle;
  background: linear-gradient(180deg, transparent, rgb(var(--primary-rgb) / 0.4), transparent);
}
</style>
