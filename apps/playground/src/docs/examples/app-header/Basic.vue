<script setup lang="ts">
import { AppHeader } from '@fzm-tech-hud/ui'
</script>

<template>
  <!-- 文档页内以静态文档流展示（floating=false），不浮动定位 -->
  <AppHeader
    title="富山基地 · 钻孔中心数字孪生平台"
    subtitle="FUSHAN DRILLING CENTER · DIGITAL TWIN SYSTEM"
    region="珠海·富山"
    weather="多云 25°C"
    :alarm-count="12"
    system-status="系统运行中"
    user-name="管理员"
  />
</template>
