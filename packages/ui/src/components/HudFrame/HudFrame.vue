<script setup lang="ts">
/**
 * HudFrame — 全屏 HUD 机甲边框（App 级外框）
 * 来源：UI设计系统规范.md 第 8.1 节
 *
 * 大屏四缘的八边形切角边框 + 上下中央扫光线 + 四角发光角标。
 * 自动渲染四角角标（tl/tr/bl/br）。
 */
withDefaults(
  defineProps<{
    /** 是否显示四角发光角标 */
    corners?: boolean
    /** 是否显示上下扫光线 */
    scanlines?: boolean
  }>(),
  {
    corners: true,
    scanlines: true,
  },
)
</script>

<template>
  <div class="fzm-hud-frame" :class="{ 'no-scanline': !scanlines }">
    <template v-if="corners">
      <span class="fzm-hud-corner tl" />
      <span class="fzm-hud-corner tr" />
      <span class="fzm-hud-corner bl" />
      <span class="fzm-hud-corner br" />
    </template>
  </div>
</template>

<style scoped>
.fzm-hud-frame {
  position: fixed;
  inset: 6px;
  z-index: 60;
  pointer-events: none;
  border: 1px solid rgb(var(--primary-rgb) / 0.22);
  clip-path: polygon(
    18px 0,
    calc(100% - 18px) 0,
    100% 18px,
    100% calc(100% - 18px),
    calc(100% - 18px) 100%,
    18px 100%,
    0 calc(100% - 18px),
    0 18px
  );
}

/* 上下中央扫光线 */
.fzm-hud-frame::before,
.fzm-hud-frame::after {
  content: '';
  position: absolute;
  width: 130px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  box-shadow: 0 0 12px rgb(var(--accent-rgb) / 0.8);
}

.fzm-hud-frame::before {
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
}

.fzm-hud-frame::after {
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
}

.fzm-hud-frame.no-scanline::before,
.fzm-hud-frame.no-scanline::after {
  display: none;
}

/* 四角发光角标 */
.fzm-hud-corner {
  position: absolute;
  width: 26px;
  height: 26px;
  border: 2px solid rgb(var(--primary-rgb) / 0.85);
  filter: drop-shadow(0 0 8px rgb(var(--primary-rgb) / 0.6));
}

.fzm-hud-corner.tl {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.fzm-hud-corner.tr {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.fzm-hud-corner.bl {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.fzm-hud-corner.br {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}
</style>
