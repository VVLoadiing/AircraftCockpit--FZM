<script setup lang="ts">
import { BaseChart, TechCard } from '@fzm-tech-hud/ui'
import { useChartMocks } from '../../../composables/useChartMocks'

const { lineOption, barOption, pieOption } = useChartMocks()
</script>

<template>
  <!-- 三张图表：每张 TechCard 给固定高度，图表用固定 height 直接渲染（避免 flex/100% 链式塌缩） -->
  <div class="charts">
    <TechCard title="折线图">
      <BaseChart :option="lineOption" height="200px" />
    </TechCard>
    <TechCard title="柱状图">
      <BaseChart :option="barOption" height="200px" />
    </TechCard>
    <TechCard title="饼图">
      <BaseChart :option="pieOption" height="200px" />
    </TechCard>
  </div>
</template>

<style scoped>
.charts {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  width: 100%;
}
</style>
