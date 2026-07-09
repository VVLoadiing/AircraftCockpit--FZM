<script setup lang="ts">
import { TechCard, CountBadge, HudButton, TechRow } from '@fzm-tech-hud/ui'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start">
    <!-- 自定义标题插槽 -->
    <TechCard style="max-width: 320px">
      <template #title>
        告警 <CountBadge :value="12" type="warning" />
      </template>
      <p>标题通过具名插槽渲染，可嵌入徽章、图标等。</p>
    </TechCard>

    <!-- 底部插槽 -->
    <TechCard title="告警列表" style="max-width: 320px">
      <TechRow>3#注塑机 温度超限 92℃</TechRow>
      <TechRow>B 区冷却水压偏低</TechRow>
      <template #footer>
        <HudButton type="primary">查看全部</HudButton>
      </template>
    </TechCard>
  </div>
</template>
