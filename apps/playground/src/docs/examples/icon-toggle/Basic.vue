<script setup lang="ts">
import { ref } from 'vue'
import { IconToggle } from '@fzm-tech-hud/ui'

const mode = ref('card')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px">
    <IconToggle
      v-model="mode"
      :items="[
        { value: 'card', label: '卡片', icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
        { value: 'list', label: '列表', icon: 'M4 6h16M4 12h16M4 18h16' },
        { value: 'map', label: '地图', icon: 'M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z M12 6a3 3 0 100 6 3 3 0 000-6z' },
      ]"
    />
    <p style="font-size: 11px; color: var(--text-secondary); margin: 0">当前：{{ mode }}</p>
  </div>
</template>
