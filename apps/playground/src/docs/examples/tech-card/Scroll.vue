<script setup lang="ts">
import { TechCard, TechRow } from '@fzm/ui'

const alerts = Array.from({ length: 8 }, (_, i) => `日志条目 #${i + 1}`)
</script>

<template>
  <TechCard title="日志（超出滚动）" max-height="160px" style="max-width: 320px">
    <TechRow v-for="(t, i) in alerts" :key="i">{{ t }}</TechRow>
  </TechCard>
</template>
