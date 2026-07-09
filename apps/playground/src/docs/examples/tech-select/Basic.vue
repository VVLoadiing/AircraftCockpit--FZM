<script setup lang="ts">
import { ref } from 'vue'
import { TechSelect } from '@fzm/ui'

const value = ref('online')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 14px; max-width: 280px">
    <TechSelect
      v-model="value"
      :options="[
        { label: '全部状态', value: 'all' },
        { label: '在线', value: 'online' },
        { label: '离线', value: 'offline', disabled: true },
        { label: '维护中', value: 'maintenance' },
      ]"
      placeholder="请选择状态"
    />
  </div>
</template>
