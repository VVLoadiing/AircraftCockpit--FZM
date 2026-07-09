<script setup lang="ts">
import { HudButton } from '@fzm/ui'
</script>

<template>
  <div style="display: flex; gap: 12px; align-items: center">
    <HudButton type="primary">
      <template #icon>
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
      </template>
      导出
    </HudButton>
    <HudButton>
      <template #icon>
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </template>
      新增
    </HudButton>
  </div>
</template>
