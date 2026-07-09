<script setup lang="ts">
import { GlassPanel } from '@fzm/ui'
</script>

<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap">
    <GlassPanel style="padding: 14px; width: 240px">
      <strong style="font-size: 12px">GlassPanel</strong>
      <p style="font-size: 11px; color: var(--text-secondary); margin: 6px 0 0">
        八边形切角 + 16px 背景模糊，适合 3D 场景之上的浮层。
      </p>
    </GlassPanel>
    <GlassPanel style="padding: 18px; width: 200px">
      <p style="font-size: 11px; color: var(--text-secondary); margin: 0">
        自身不带内边距，按需通过 style/class 调整 padding。
      </p>
    </GlassPanel>
  </div>
</template>
