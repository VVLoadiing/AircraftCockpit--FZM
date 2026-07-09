<script setup lang="ts">
import { ref } from 'vue'
import { TechSwitch } from '@fzm/ui'

const a = ref(true)
const b = ref(false)
const c = ref(true)
</script>

<template>
  <div style="display: flex; gap: 24px; align-items: center">
    <span style="display: inline-flex; align-items: center; gap: 10px; font-size: 11px; color: var(--text-secondary)">
      自动模式 <TechSwitch v-model="a" />
    </span>
    <span style="display: inline-flex; align-items: center; gap: 10px; font-size: 11px; color: var(--text-secondary)">
      小尺寸 <TechSwitch v-model="c" size="small" />
    </span>
    <TechSwitch v-model="b" disabled />
  </div>
</template>
