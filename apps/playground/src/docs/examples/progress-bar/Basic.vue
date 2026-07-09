<script setup lang="ts">
import { ProgressBar } from '@fzm-tech-hud/ui'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 420px">
    <ProgressBar :value="42" type="info" show-t />
    <ProgressBar :value="68" type="success" show-t />
    <ProgressBar :value="85" type="warning" show-t />
    <ProgressBar :value="23" type="danger" show-t />
    <ProgressBar :value="100" :shimmer="false" />
  </div>
</template>
