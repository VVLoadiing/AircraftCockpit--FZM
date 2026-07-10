<script setup lang="ts">
import { ref } from 'vue'
import { TechRate } from '@fzm-tech-hud/ui'

const val1 = ref(3)
const val2 = ref(2.5)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 18px">
    <div style="display: flex; align-items: center; gap: 12px">
      <span style="font-size: 12px; color: var(--text-secondary)">默认评分</span>
      <TechRate v-model="val1" />
    </div>
    <div style="display: flex; align-items: center; gap: 12px">
      <span style="font-size: 12px; color: var(--text-secondary)">支持半星</span>
      <TechRate v-model="val2" allow-half />
    </div>
    <div style="display: flex; align-items: center; gap: 12px">
      <span style="font-size: 12px; color: var(--text-secondary)">只读</span>
      <TechRate :model-value="4" readonly />
    </div>
  </div>
</template>
