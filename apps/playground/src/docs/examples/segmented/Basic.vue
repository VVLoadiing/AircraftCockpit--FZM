<script setup lang="ts">
import { ref } from 'vue'
import { Segmented } from '@fzm/ui'

const range = ref('day')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px">
    <Segmented
      v-model="range"
      :items="[
        { value: 'day', label: '日' },
        { value: 'week', label: '周' },
        { value: 'month', label: '月' },
      ]"
    />
    <Segmented
      v-model="range"
      :items="[
        { value: 'day', label: '日' },
        { value: 'week', label: '周' },
        { value: 'month', label: '月' },
      ]"
      block
      style="max-width: 360px"
    />
  </div>
</template>
