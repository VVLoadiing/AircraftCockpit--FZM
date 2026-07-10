<script setup lang="ts">
import { ref } from 'vue'
import { TechTextarea } from '@fzm-tech-hud/ui'

const value = ref('')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px">
    <TechTextarea v-model="value" placeholder="请输入备注（4 行）" :rows="4" />
    <TechTextarea v-model="value" placeholder="带字数统计（最多 50 字）" :rows="3" :maxlength="50" show-count />
  </div>
</template>
