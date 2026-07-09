<script setup lang="ts">
import { KpiItem } from '@fzm/ui'
</script>

<template>
  <div style="display: flex">
    <KpiItem :value="186" label="在线设备" type="success" />
    <KpiItem :value="12" label="告警数" type="warning" />
    <KpiItem :value="3" label="故障数" type="danger" />
    <KpiItem :value="94.6" unit="%" label="OEE" type="info" />
    <KpiItem :value="1284" label="今日产量" />
  </div>
</template>
