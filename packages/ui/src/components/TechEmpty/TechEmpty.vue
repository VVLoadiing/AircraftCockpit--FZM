<script setup lang="ts">
/**
 * TechEmpty — 空状态占位
 * 机甲风六边形图标 + 描述文字 + 可选操作插槽。
 */
withDefaults(
  defineProps<{
    /** 描述文字 */
    description?: string
    /** 图标样式 */
    icon?: 'default' | 'search' | 'network' | 'lock'
  }>(),
  {
    description: '暂无数据',
    icon: 'default',
  },
)
</script>

<template>
  <div class="fzm-empty">
    <div class="fzm-empty__icon" :class="`is-${icon}`">
      <svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <!-- 六边形外框（机甲感） -->
        <path d="M24 4l16 9.2v21.6L24 44 8 34.8V13.2z" opacity="0.5" />
        <!-- 内部图标 -->
        <template v-if="icon === 'search'">
          <circle cx="22" cy="22" r="7" />
          <path d="M27 27l6 6" />
        </template>
        <template v-else-if="icon === 'network'">
          <path d="M16 30c0-6 4-10 8-10s8 4 8 10" opacity="0.7" />
          <path d="M12 30c0-9 5-15 12-15s12 6 12 15" opacity="0.4" />
          <circle cx="24" cy="30" r="1.5" fill="currentColor" />
        </template>
        <template v-else-if="icon === 'lock'">
          <rect x="17" y="22" width="14" height="11" rx="2" />
          <path d="M20 22v-3a4 4 0 018 0v3" />
        </template>
        <template v-else>
          <!-- 默认：空文档 -->
          <path d="M18 16h12v16H18z" opacity="0.6" />
          <path d="M21 22h6M21 26h6" opacity="0.4" />
        </template>
      </svg>
    </div>
    <p class="fzm-empty__desc">{{ description }}</p>
    <div v-if="$slots.default" class="fzm-empty__action">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.fzm-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px 16px;
  text-align: center;
}

.fzm-empty__icon {
  color: var(--primary);
  opacity: 0.5;
  filter: drop-shadow(0 0 8px rgb(var(--primary-rgb) / 0.4));
  animation: fzm-empty-float 3s ease-in-out infinite;
}

.fzm-empty__desc {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
  opacity: 0.7;
  letter-spacing: 0.5px;
}

.fzm-empty__action {
  margin-top: 4px;
}

@keyframes fzm-empty-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
</style>
