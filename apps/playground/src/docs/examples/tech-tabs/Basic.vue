<script setup lang="ts">
import { ref } from 'vue'
import { TechTabs } from '@fzm/ui'

const tab = ref('overview')
</script>

<template>
  <div style="max-width: 420px">
    <TechTabs
      v-model="tab"
      :items="[
        { value: 'overview', label: '概览' },
        { value: 'detail', label: '详情' },
        { value: 'log', label: '日志' },
      ]"
    >
      <div v-if="tab === 'overview'" style="font-size: 12px; color: var(--text-secondary); padding: 8px 0">概览面板内容</div>
      <div v-else-if="tab === 'detail'" style="font-size: 12px; color: var(--text-secondary); padding: 8px 0">详情面板内容</div>
      <div v-else style="font-size: 12px; color: var(--text-secondary); padding: 8px 0">日志面板内容</div>
    </TechTabs>
  </div>
</template>
