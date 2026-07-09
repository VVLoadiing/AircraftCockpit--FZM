<script setup lang="ts">
import { MetricBox } from '@fzm/ui'
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; width: 100%; max-width: 480px">
    <MetricBox :value="1284" unit="件" label="今日产量" type="success" />
    <MetricBox :value="3.2" unit="kWh" label="能耗" type="warning" />
    <MetricBox :value="98.2" unit="%" label="良品率" />
    <MetricBox :value="2.1" unit="%" label="不良率" type="danger" />
  </div>
</template>
