<script setup lang="ts">
import { ref } from 'vue'
import { CountUp, HudButton } from '@fzm-tech-hud/ui'

const value = ref(1284)
const target = ref(2000)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start">
    <div style="display: flex; gap: 32px; align-items: center">
      <CountUp :value="value" suffix="件" type="success" />
      <CountUp :value="94.6" :decimals="1" suffix="%" type="warning" />
      <CountUp :value="100" :thousand="false" prefix="¥" />
    </div>
    <HudButton type="primary" @click="value = value === 1284 ? target : 1284">
      切换数值（当前 {{ value }}）
    </HudButton>
  </div>
</template>
