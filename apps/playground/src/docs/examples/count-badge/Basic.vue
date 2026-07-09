<script setup lang="ts">
import { CountBadge, LevelBadge } from '@fzm/ui'
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 14px; align-items: center">
    <CountBadge :value="99" />
    <CountBadge :value="12" type="warning" />
    <CountBadge :value="3" type="danger" />
    <CountBadge value="OK" type="success" />
    <LevelBadge level="high" text="高危" />
    <LevelBadge level="mid" text="中危" />
    <LevelBadge level="low" text="低危" />
  </div>
</template>
