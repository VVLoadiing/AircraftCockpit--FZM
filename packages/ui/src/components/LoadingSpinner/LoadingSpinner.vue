<script setup lang="ts">
/**
 * LoadingSpinner — 加载中（机甲风双环）
 * 双层旋转环（外环顺时针、内环逆时针）+ 主题色辉光 + 可选文字。
 */
withDefaults(
  defineProps<{
    /** 尺寸（px） */
    size?: number
    /** 描述文字 */
    text?: string
  }>(),
  {
    size: 28,
    text: '',
  },
)
</script>

<template>
  <div class="fzm-loading" :class="{ 'has-text': text }">
    <span class="fzm-loading__spinner" :style="{ width: size + 'px', height: size + 'px' }">
      <svg class="fzm-loading__ring fzm-loading__ring--outer" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="90 150" />
      </svg>
      <svg class="fzm-loading__ring fzm-loading__ring--inner" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="50 80" opacity="0.6" />
      </svg>
    </span>
    <span v-if="text" class="fzm-loading__text">{{ text }}</span>
  </div>
</template>

<style scoped>
.fzm-loading {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.fzm-loading.has-text {
  flex-direction: column;
  gap: 6px;
}

.fzm-loading__spinner {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  filter: drop-shadow(0 0 6px rgb(var(--primary-rgb) / 0.6));
}

.fzm-loading__ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.fzm-loading__ring--outer {
  animation: fzm-spin 1.2s linear infinite;
}

.fzm-loading__ring--inner {
  animation: fzm-spin-reverse 0.9s linear infinite;
}

.fzm-loading__text {
  font-size: 11px;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

@keyframes fzm-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fzm-spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}
</style>
