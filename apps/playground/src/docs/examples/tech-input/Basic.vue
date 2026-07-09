<script setup lang="ts">
import { ref } from 'vue'
import { TechInput } from '@fzm-tech-hud/ui'

const value = ref('FX-3200')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px">
    <TechInput v-model="value" placeholder="请输入设备编号" clearable>
      <template #prefix>
        <span style="font-size: 10px">ID</span>
      </template>
    </TechInput>
    <TechInput model-value="" placeholder="禁用状态" disabled />
    <TechInput v-model="value" placeholder="带后缀">
      <template #suffix>台</template>
    </TechInput>
  </div>
</template>
