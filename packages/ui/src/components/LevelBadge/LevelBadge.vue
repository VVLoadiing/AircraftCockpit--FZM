<script setup lang="ts">
/**
 * LevelBadge — 告警等级徽章
 * 来源：UI设计系统规范.md 第 7.8 节（.level-badge）
 * 红/黄/蓝切角小标。
 */
import type { LevelType } from '../../types'

withDefaults(
  defineProps<{
    /** 等级：high(红) / mid(黄) / low(蓝) */
    level?: LevelType
    /** 文字（默认取等级名） */
    text?: string
  }>(),
  {
    level: 'low',
    text: '',
  },
)

const LEVEL_TEXT: Record<LevelType, string> = {
  high: '高',
  mid: '中',
  low: '低',
}
</script>

<template>
  <span class="fzm-level-badge" :class="`is-${level}`">
    <slot>{{ text || LEVEL_TEXT[level] }}</slot>
  </span>
</template>

<style scoped>
.fzm-level-badge {
  display: inline-flex;
  align-items: center;
  height: 16px;
  padding: 0 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #fff;
  border-radius: var(--radius-sm);
  clip-path: polygon(
    3px 0,
    100% 0,
    calc(100% - 3px) 100%,
    0 100%
  );
  line-height: 1;
}

.fzm-level-badge.is-high {
  color: var(--danger-light);
  background: rgb(var(--danger-rgb) / 0.22);
  border: 1px solid rgb(var(--danger-rgb) / 0.5);
  text-shadow: 0 0 8px rgb(var(--danger-rgb) / 0.6);
}

.fzm-level-badge.is-mid {
  color: var(--warning-light);
  background: rgb(var(--warning-rgb) / 0.2);
  border: 1px solid rgb(var(--warning-rgb) / 0.5);
  text-shadow: 0 0 8px rgb(var(--warning-rgb) / 0.6);
}

.fzm-level-badge.is-low {
  color: var(--primary-lighter);
  background: rgb(var(--primary-rgb) / 0.18);
  border: 1px solid var(--primary-border);
  text-shadow: 0 0 8px rgb(var(--primary-rgb) / 0.6);
}
</style>
