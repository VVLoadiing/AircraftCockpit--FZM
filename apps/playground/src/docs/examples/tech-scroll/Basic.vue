<script setup lang="ts">
import { ref } from 'vue'
import { TechScroll, TechRow } from '@fzm-tech-hud/ui'

const items = ref(Array.from({ length: 15 }, (_, i) => `数据条目 #${i + 1}`))
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 10px; max-width: 320px">
    <span style="font-size: 11px; color: var(--text-muted); opacity: 0.7">hover 显示滚动条（默认）</span>
    <TechScroll height="160px" scrollbar="hover">
      <TechRow v-for="(t, i) in items" :key="i">{{ t }}</TechRow>
    </TechScroll>

    <span style="font-size: 11px; color: var(--text-muted); opacity: 0.7">滚动条常驻</span>
    <TechScroll height="120px" scrollbar="always">
      <TechRow v-for="(t, i) in items" :key="i">{{ t }}</TechRow>
    </TechScroll>
  </div>
</template>
