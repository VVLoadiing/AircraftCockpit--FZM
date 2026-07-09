<script setup lang="ts">
import { ref } from 'vue'
import { TechScroll, TechRow, LevelBadge } from '@fzm-tech-hud/ui'

const alerts = ref([
  { level: 'high' as const, text: '3#注塑机 温度超限 92℃', time: '12:04' },
  { level: 'mid' as const, text: 'B 区冷却水压偏低', time: '12:01' },
  { level: 'low' as const, text: '7#传送带 计划维护', time: '11:58' },
  { level: 'high' as const, text: '仓储 W2 烟感报警', time: '11:50' },
  { level: 'mid' as const, text: '主产线 节拍偏差 +6%', time: '11:42' },
])
</script>

<template>
  <div style="max-width: 360px">
    <p style="font-size: 11px; color: var(--text-muted); opacity: 0.7; margin: 0 0 8px">
      无缝循环匀速滚动，鼠标悬停暂停（speed=30）
    </p>
    <TechScroll height="150px" auto-scroll :speed="30" pause-on-hover>
      <TechRow v-for="(a, i) in alerts" :key="i">
        <template #prefix>
          <LevelBadge :level="a.level" />
        </template>
        {{ a.text }}
        <template #suffix>
          <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted)">{{ a.time }}</span>
        </template>
      </TechRow>
    </TechScroll>
  </div>
</template>
