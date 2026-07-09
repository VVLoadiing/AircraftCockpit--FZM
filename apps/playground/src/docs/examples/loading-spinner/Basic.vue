<script setup lang="ts">
import { LoadingSpinner } from '@fzm-tech-hud/ui'
</script>

<template>
  <div style="display: flex; gap: 32px; align-items: center; flex-wrap: wrap">
    <LoadingSpinner />
    <LoadingSpinner text="加载中" />
    <LoadingSpinner :size="40" text="同步数据" />
  </div>
</template>
