<script setup lang="ts">
import { TechAvatar } from '@fzm/ui'
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 18px; align-items: center">
    <TechAvatar text="设备A" :size="40" status="running" />
    <TechAvatar text="Zhang" :size="40" shape="circle" status="standby" />
    <TechAvatar text="仓W2" :size="40" status="error" />
    <TechAvatar src="" text="机房" :size="40" status="offline" />
    <TechAvatar text="Admin" :size="48" shape="circle" />
  </div>
</template>
