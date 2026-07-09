<script setup lang="ts">
import { FzGlass, FzGlassTitle, FzGlassRow, FzGlassClose } from '@fzm/ui'
</script>

<template>
  <FzGlass style="padding: 14px; width: 300px">
    <FzGlassTitle title="设备详情 · FX-3200" />
    <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 10px">
      <FzGlassRow label="运行时长" value="1,284h" />
      <FzGlassRow label="当前温度" value="68℃" />
      <FzGlassRow label="健康度" value="96%" />
    </div>
    <div style="display: flex; justify-content: flex-end; margin-top: 12px">
      <FzGlassClose />
    </div>
  </FzGlass>
</template>
