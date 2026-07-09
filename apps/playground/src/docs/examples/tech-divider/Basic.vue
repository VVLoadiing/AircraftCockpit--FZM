<script setup lang="ts">
import { TechDivider } from '@fzm-tech-hud/ui'
</script>

<template>
  <div style="width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 10px">
    <p style="font-size: 12px; color: var(--text-secondary); margin: 0">基础分割线</p>
    <TechDivider />
    <TechDivider>分区标题（居中）</TechDivider>
    <TechDivider align="left">左对齐</TechDivider>
    <TechDivider align="right">右对齐</TechDivider>
    <div style="display: flex; align-items: center; gap: 8px">
      <span style="font-size: 12px">A</span>
      <TechDivider direction="vertical" />
      <span style="font-size: 12px">B</span>
      <TechDivider direction="vertical" />
      <span style="font-size: 12px">C</span>
    </div>
  </div>
</template>
