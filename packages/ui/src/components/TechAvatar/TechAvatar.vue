<script setup lang="ts">
/**
 * TechAvatar — 头像 / 设备图标
 * 切角容器 + 图片/文字/图标 fallback + 可选状态点 + 尺寸。
 */
import { computed } from 'vue'
import type { StatusType } from '../../types'

const props = withDefaults(
  defineProps<{
    /** 图片地址 */
    src?: string
    /** 文字（src 无效或未传时显示，取首字） */
    text?: string
    /** 尺寸 */
    size?: number
    /** 形状 */
    shape?: 'square' | 'circle'
    /** 状态点（叠加右下角） */
    status?: StatusType | ''
  }>(),
  {
    src: '',
    text: '',
    size: 36,
    shape: 'square',
    status: '',
  },
)

/** 文字头像取前 1-2 个字符 */
const initials = computed(() => {
  if (!props.text) return ''
  const t = props.text.trim()
  // 中文取首字，英文取首字母大写
  return /[\u4e00-\u9fa5]/.test(t) ? t.slice(0, 1) : t.slice(0, 2).toUpperCase()
})
</script>

<template>
  <span class="fzm-avatar" :class="[`is-${shape}`, status ? `has-status is-status-${status}` : '']" :style="{ width: size + 'px', height: size + 'px' }">
    <img v-if="src" :src="src" :alt="text" class="fzm-avatar__img" />
    <span v-else class="fzm-avatar__text">{{ initials }}</span>
    <span v-if="status" class="fzm-avatar__status" :class="`is-${status}`" />
  </span>
</template>

<style scoped>
.fzm-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--primary-gradient-soft);
  border: 1px solid var(--border-color);
  color: var(--primary-lighter);
  font-size: 13px;
  font-weight: 700;
  font-family: var(--font-mono);
  text-shadow: 0 0 8px rgb(var(--primary-rgb) / 0.5);
  /* 切角（左上+右下） */
  clip-path: polygon(
    6px 0,
    100% 0,
    100% calc(100% - 6px),
    calc(100% - 6px) 100%,
    0 100%,
    0 6px
  );
}

.fzm-avatar.is-circle {
  border-radius: 50%;
  clip-path: none;
}

.fzm-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fzm-avatar__text {
  line-height: 1;
}

/* 状态点（右下角） */
.fzm-avatar__status {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 2px solid var(--bg-card-strong);
}

.fzm-avatar__status.is-running {
  background: var(--success);
  box-shadow: 0 0 6px rgb(var(--status-running-rgb) / 0.8);
}

.fzm-avatar__status.is-standby {
  background: var(--primary);
  box-shadow: 0 0 6px rgb(var(--primary-rgb) / 0.6);
}

.fzm-avatar__status.is-error {
  background: #ff5f5f;
  box-shadow: 0 0 6px rgba(255, 95, 95, 0.8);
}

.fzm-avatar__status.is-offline {
  background: #64748b;
}

.fzm-avatar__status.is-stopped {
  background: #94a3b8;
}

.fzm-avatar__status.is-maintenance {
  background: var(--warning);
  box-shadow: 0 0 6px rgb(var(--warning-rgb) / 0.6);
}
</style>
