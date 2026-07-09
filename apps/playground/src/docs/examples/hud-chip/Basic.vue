<script setup lang="ts">
import { HudChip } from '@fzm/ui'
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
    <HudChip>DEFAULT</HudChip>
    <HudChip type="success">SUCCESS</HudChip>
    <HudChip type="warning">WARNING</HudChip>
    <HudChip type="danger">DANGER</HudChip>
    <HudChip type="info">INFO</HudChip>
  </div>
</template>
