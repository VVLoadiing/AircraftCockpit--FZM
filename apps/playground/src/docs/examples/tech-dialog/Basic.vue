<script setup lang="ts">
import { ref } from 'vue'
import { TechDialog, HudButton } from '@fzm-tech-hud/ui'

const visible = ref(false)
</script>

<template>
  <div style="display: flex; gap: 12px">
    <HudButton type="primary" @click="visible = true">打开对话框</HudButton>

    <TechDialog
      v-model:visible="visible"
      title="操作确认"
      width="420px"
      show-footer
      @confirm="visible = false"
    >
      确定要执行此操作吗？此操作不可撤销，请谨慎确认。
    </TechDialog>
  </div>
</template>
