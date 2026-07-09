<script setup lang="ts">
import { ref } from 'vue'
import { TechTag } from '@fzm-tech-hud/ui'

const tags = ref(['产线A', 'A区', '高温', '待复核'])
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start">
    <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center">
      <TechTag>默认</TechTag>
      <TechTag type="success">运行中</TechTag>
      <TechTag type="warning">预警</TechTag>
      <TechTag type="danger">故障</TechTag>
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center">
      <TechTag v-for="(t, i) in tags" :key="t" closable @close="tags.splice(i, 1)">{{ t }}</TechTag>
    </div>
  </div>
</template>
