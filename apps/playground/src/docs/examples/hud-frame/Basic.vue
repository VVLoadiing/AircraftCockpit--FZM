<script setup lang="ts">
import { HudFrame } from '@fzm-tech-hud/ui'
</script>

<template>
  <!-- HudFrame 默认 position:fixed 全屏覆盖，这里仅展示角标效果 -->
  <div class="frame-demo">
    <HudFrame />
    <p class="frame-demo__hint">四角发光角标 + 上下扫光线（pointer-events:none，不拦截交互）</p>
  </div>
</template>

<style scoped>
.frame-demo {
  position: relative;
  height: 200px;
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.frame-demo__hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
  pointer-events: none;
}
</style>
