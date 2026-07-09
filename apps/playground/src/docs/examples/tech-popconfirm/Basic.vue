<script setup lang="ts">
import { TechPopconfirm, HudButton, Message } from '@fzm-tech-hud/ui'

function onConfirm() {
  Message.success('已确认操作')
}
function onDelete() {
  Message.success('已删除')
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px; align-items: flex-start">
    <!-- 基础确认（上方弹出） -->
    <TechPopconfirm title="确定要执行此操作吗？" @confirm="onConfirm">
      <HudButton type="primary">点击确认</HudButton>
    </TechPopconfirm>

    <!-- 危险操作（danger 确认按钮） -->
    <TechPopconfirm title="删除后数据将无法恢复，确定删除？" confirm-text="删除" confirm-type="danger" @confirm="onDelete">
      <HudButton type="danger">删除设备</HudButton>
    </TechPopconfirm>

    <!-- 下方弹出 -->
    <TechPopconfirm title="气泡在下方弹出" placement="bottom" @confirm="onConfirm">
      <HudButton>下方弹出</HudButton>
    </TechPopconfirm>
  </div>
</template>
