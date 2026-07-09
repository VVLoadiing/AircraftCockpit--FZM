<script setup lang="ts">
import { Sidebar, TechCard, DataRow } from '@fzm-tech-hud/ui'
</script>

<template>
  <div style="display: flex; gap: 16px; align-items: flex-start">
    <Sidebar style="position: relative; height: auto; max-height: 360px">
      <TechCard title="设备概览">
        <DataRow label="型号" value="FX-3200" />
        <DataRow label="位置" value="A 区 03 工位" />
        <DataRow label="负责人" value="张工" />
      </TechCard>
      <TechCard title="告警列表">
        <DataRow label="高危" value="3" />
        <DataRow label="中危" value="5" />
      </TechCard>
    </Sidebar>
  </div>
</template>
