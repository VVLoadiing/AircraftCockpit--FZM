<script setup lang="ts">
import { StatusDot } from '@fzm/ui'
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 18px; align-items: center">
    <StatusDot type="running" label="运行" />
    <StatusDot type="standby" label="待机" />
    <StatusDot type="stopped" label="停止" />
    <StatusDot type="error" label="故障" />
    <StatusDot type="maintenance" label="维护" />
    <StatusDot type="offline" label="离线" />
  </div>
</template>
