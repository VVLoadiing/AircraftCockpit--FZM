<script setup lang="ts">
import { FzGlass } from '@fzm/ui'
</script>

<template>
  <div style="display: flex; gap: 16px">
    <FzGlass style="padding: 16px; width: 160px">
      <p style="font-size: 11px; margin: 0; color: var(--text-secondary)">默认玻璃底</p>
    </FzGlass>
    <FzGlass strong style="padding: 16px; width: 160px">
      <p style="font-size: 11px; margin: 0; color: var(--text-secondary)">strong 加强不透明底</p>
    </FzGlass>
  </div>
</template>
