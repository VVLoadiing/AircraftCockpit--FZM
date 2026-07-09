<script setup lang="ts">
import { ref } from 'vue'
import { TechDialog, HudButton } from '@fzm-tech-hud/ui'

const visible = ref(false)
const loading = ref(false)

async function onConfirm() {
  loading.value = true
  // 模拟异步提交
  await new Promise((r) => setTimeout(r, 1200))
  loading.value = false
  visible.value = false
}
</script>

<template>
  <HudButton type="danger" @click="visible = true">删除（异步确认）</HudButton>

  <TechDialog
    v-model:visible="visible"
    title="删除确认"
    width="420px"
    show-footer
    confirm-text="确认删除"
    :confirm-loading="loading"
    @confirm="onConfirm"
  >
    确定要删除该设备吗？删除后数据将无法恢复。
  </TechDialog>
</template>
