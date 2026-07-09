<script setup lang="ts">
import { TechCard, DataRow } from '@fzm-tech-hud/ui'
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start">
    <TechCard title="设备概览" style="max-width: 260px">
      <DataRow label="型号" value="FX-3200" />
      <DataRow label="位置" value="A 区 03 工位" />
      <DataRow label="负责人" value="张工" />
    </TechCard>
    <TechCard title="静态展示" :hoverable="false" style="max-width: 260px">
      <p>设置 hoverable=false 可关闭悬停辉光，适合静态展示。</p>
    </TechCard>
  </div>
</template>
