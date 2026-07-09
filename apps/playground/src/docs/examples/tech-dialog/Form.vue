<script setup lang="ts">
import { ref } from 'vue'
import { TechDialog, HudButton, TechInput } from '@fzm-tech-hud/ui'

const visible = ref(false)
const name = ref('')
const code = ref('')
</script>

<template>
  <HudButton @click="visible = true">新增设备（自定义内容）</HudButton>

  <TechDialog v-model:visible="visible" title="新增设备" width="460px" show-footer confirm-text="保存">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <label style="display: flex; flex-direction: column; gap: 5px">
        <span style="font-size: 11px; color: var(--text-muted)">设备名称</span>
        <TechInput v-model="name" placeholder="请输入设备名称" />
      </label>
      <label style="display: flex; flex-direction: column; gap: 5px">
        <span style="font-size: 11px; color: var(--text-muted)">设备编号</span>
        <TechInput v-model="code" placeholder="请输入设备编号" />
      </label>
    </div>
  </TechDialog>
</template>
