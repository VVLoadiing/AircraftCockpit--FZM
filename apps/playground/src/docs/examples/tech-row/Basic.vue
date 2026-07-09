<script setup lang="ts">
import { TechRow, LevelBadge } from '@fzm-tech-hud/ui'

const alerts = [
  { level: 'high' as const, text: '3#注塑机 温度超限 92℃', time: '12:04:21' },
  { level: 'mid' as const, text: 'B 区冷却水压偏低', time: '12:01:08' },
  { level: 'low' as const, text: '7#传送带 计划维护', time: '11:58:33' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 6px; max-width: 360px">
    <TechRow active>
      <template #prefix>
        <LevelBadge :level="alerts[0].level" text="高危" />
      </template>
      {{ alerts[0].text }}
      <template #suffix>
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted)">{{ alerts[0].time }}</span>
      </template>
    </TechRow>
    <TechRow v-for="(a, i) in alerts.slice(1)" :key="i">
      <template #prefix>
        <LevelBadge :level="a.level" />
      </template>
      {{ a.text }}
      <template #suffix>
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted)">{{ a.time }}</span>
      </template>
    </TechRow>
  </div>
</template>
