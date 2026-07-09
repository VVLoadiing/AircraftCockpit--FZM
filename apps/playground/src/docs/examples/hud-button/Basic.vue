<script setup lang="ts">
import { HudButton } from '@fzm-tech-hud/ui'
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
    <HudButton>默认</HudButton>
    <HudButton type="primary">主操作</HudButton>
    <HudButton type="success">成功</HudButton>
    <HudButton type="warning">警告</HudButton>
    <HudButton type="danger">危险</HudButton>
    <HudButton type="info">信息</HudButton>
    <HudButton disabled>禁用</HudButton>
  </div>
</template>
