<script setup lang="ts">
import { ref } from 'vue'
import { TechSelect } from '@fzm/ui'

const value = ref('cyan')
const themes = [
  { label: '曜蓝·通透', value: 'cyan', color: '#6fb2c9', desc: '默认' },
  { label: '青空', value: 'green', color: '#22d3ee', desc: 'SaaS' },
  { label: '星云', value: 'violet', color: '#a78bfa', desc: 'AI' },
]

// option.color 来自 options 的额外字段，类型为 unknown，转成安全样式对象
function dotStyle(color: unknown) {
  return color ? { background: String(color) } : undefined
}
</script>

<template>
  <TechSelect v-model="value" :options="themes" style="max-width: 240px">
    <template #trigger="{ label, option }">
      <span style="display: inline-flex; align-items: center; gap: 7px">
        <span class="dot" :style="dotStyle(option?.color)" />
        {{ label }}
      </span>
    </template>
    <template #option="{ option }">
      <span style="display: inline-flex; align-items: center; gap: 7px; width: 100%">
        <span class="dot" :style="dotStyle(option.color)" />
        <b style="font-weight: 600">{{ option.label }}</b>
        <small style="margin-left: auto; opacity: 0.6; font-size: 10px">{{ option.desc }}</small>
      </span>
    </template>
  </TechSelect>
</template>

<style scoped>
.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
