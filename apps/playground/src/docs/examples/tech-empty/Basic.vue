<script setup lang="ts">
import { TechEmpty, HudButton } from '@fzm-tech-hud/ui'
</script>

<template>
  <div style="display: flex; gap: 24px; flex-wrap: wrap">
    <TechEmpty description="暂无告警">
      <HudButton type="primary">刷新</HudButton>
    </TechEmpty>
    <TechEmpty icon="search" description="未找到匹配设备" />
    <TechEmpty icon="network" description="网络连接失败" />
  </div>
</template>
