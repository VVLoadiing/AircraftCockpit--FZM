<script setup lang="ts">
import { DataRow, ProgressBar } from '@fzm/ui'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 2px; max-width: 320px">
    <DataRow label="设备 ID" value="FX-3200-007" />
    <DataRow label="运行时长" value="1,284h" />
    <DataRow label="负责人" value="张工" />
    <!-- 插槽自定义值内容 -->
    <DataRow label="健康度">
      <ProgressBar :value="96" type="success" style="width: 120px" />
    </DataRow>
  </div>
</template>
