<script setup lang="ts">
import { Message, HudButton } from '@fzm-tech-hud/ui'

// 命令式 API：一行调用，自动出现在顶部并定时消失
function success() {
  Message.success('保存成功')
}
function info() {
  Message.info('新版本 v2.0 已发布')
}
function warning() {
  Message.warning('库存不足，请及时补货')
}
function danger() {
  Message.danger('删除失败，请稍后重试')
}
function customDuration() {
  Message.success('这条消息显示 5 秒', 5000)
}
function closeAll() {
  Message.closeAll()
}
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 10px">
    <HudButton type="success" @click="success">成功</HudButton>
    <HudButton @click="info">信息</HudButton>
    <HudButton type="warning" @click="warning">警告</HudButton>
    <HudButton type="danger" @click="danger">错误</HudButton>
    <HudButton type="primary" @click="customDuration">显示 5 秒</HudButton>
    <HudButton @click="closeAll">关闭全部</HudButton>
  </div>
</template>
