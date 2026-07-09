<script setup lang="ts">
/**
 * TechMessage — 消息提示（命令式 API 的渲染层）
 *
 * 本组件是消息队列的单例渲染容器，由 useMessage 内部挂载到 body。
 * 业务侧不直接使用本组件，而是调用 Message.success() / Message.warning() 等命令式 API。
 *
 * 每条消息：图标 + 文字 + 可选关闭，从顶部滑入，duration 后自动消失。
 */
import { computed } from 'vue'

defineProps<{
  /** 消息类型 */
  type?: 'info' | 'success' | 'warning' | 'danger'
  /** 文字内容 */
  text?: string
}>()
</script>

<template>
  <div class="fzm-message" :class="`is-${type}`">
    <!-- 类型图标 -->
    <span class="fzm-message__icon">
      <svg v-if="type === 'success'" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
      <svg v-else-if="type === 'warning'" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 9v4M12 17v.5M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      </svg>
      <svg v-else-if="type === 'danger'" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
      <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 16v-4M12 8v.5M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
      </svg>
    </span>
    <span class="fzm-message__text">{{ text }}</span>
  </div>
</template>

<style scoped>
.fzm-message {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 360px;
  padding: 9px 16px;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: var(--text-primary);
  /* 跟随主题的实底卡片（深色主题=深蓝，浅色主题=白），文字始终高对比清晰 */
  background: var(--bg-card-strong);
  border: 1px solid rgb(var(--primary-rgb) / 0.32);
  border-radius: var(--radius-md);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.28),
    0 0 16px rgb(var(--primary-rgb) / 0.14);
  /* 切角呼应科技风 */
  clip-path: polygon(
    var(--notch) 0,
    100% 0,
    100% calc(100% - var(--notch)),
    calc(100% - var(--notch)) 100%,
    0 100%,
    0 var(--notch)
  );
  pointer-events: auto;
}

.fzm-message__icon {
  display: inline-flex;
  flex-shrink: 0;
}

/* 类型配色（图标 + 左侧强调边） */
.fzm-message.is-success .fzm-message__icon {
  color: var(--success-light);
}
.fzm-message.is-warning .fzm-message__icon {
  color: var(--warning-light);
}
.fzm-message.is-danger .fzm-message__icon {
  color: var(--danger-light);
}
.fzm-message.is-info .fzm-message__icon {
  color: var(--primary);
}

.fzm-message__text {
  line-height: 1.5;
  word-break: break-word;
}
</style>
