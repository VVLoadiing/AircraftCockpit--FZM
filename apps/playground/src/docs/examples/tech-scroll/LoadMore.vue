<script setup lang="ts">
import { ref } from 'vue'
import { TechScroll, TechRow, HudButton } from '@fzm-tech-hud/ui'

const list = ref(Array.from({ length: 10 }, (_, i) => `条目 #${i + 1}`))
const loading = ref(false)
const finished = ref(false)
let page = 1

async function onLoad() {
  if (loading.value || finished.value) return
  loading.value = true
  // 模拟异步请求
  await new Promise((r) => setTimeout(r, 800))
  page++
  const next = Array.from({ length: 8 }, (_, i) => `条目 #${(page - 1) * 8 + i + 1}`)
  list.value.push(...next)
  loading.value = false
  // 第 5 页后停止加载
  if (page >= 5) finished.value = true
}

function reset() {
  page = 1
  list.value = Array.from({ length: 10 }, (_, i) => `条目 #${i + 1}`)
  finished.value = false
}
</script>

<template>
  <div style="max-width: 320px">
    <p style="font-size: 11px; color: var(--text-muted); opacity: 0.7; margin: 0 0 8px">
      滚动到底部自动加载（{{ list.length }} 条{{ finished ? ' · 已全部加载' : '' }}）
    </p>
    <TechScroll height="180px" load-more :loading="loading" :load-distance="30" scrollbar="always" @load-more="onLoad">
      <TechRow v-for="(t, i) in list" :key="i">{{ t }}</TechRow>
    </TechScroll>
    <div style="margin-top: 10px">
      <HudButton @click="reset">重置</HudButton>
    </div>
  </div>
</template>
