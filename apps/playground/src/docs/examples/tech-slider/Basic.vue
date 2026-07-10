<script setup lang="ts">
import { ref } from 'vue'
import { TechSlider } from '@fzm-tech-hud/ui'

const val1 = ref(40)
const val2 = ref(75)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px; max-width: 360px">
    <TechSlider v-model="val1" show-value />
    <TechSlider v-model="val2" :min="0" :max="1000" :step="50" show-value />
    <TechSlider :model-value="30" disabled show-value />
  </div>
</template>
