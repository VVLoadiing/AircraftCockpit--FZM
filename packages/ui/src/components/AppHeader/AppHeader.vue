<script setup lang="ts">
/**
 * AppHeader — 应用级机甲风头部浮条
 *
 * 视觉特征（复刻设计文档第 8.2 节大屏标准布局的顶部浮条）：
 *   - 毛玻璃浮条底（fz-glass）+ 左上/右上 HUD 切角标记
 *   - 左侧：logo 区 + 渐变机甲标题（白→主题色）
 *   - 中间：电流母线 spacer（流动脉冲 + 旋转菱形锚点，机甲能量管线感）
 *   - 右侧：状态组（地域/天气/系统状态/告警铃铛/时间）+ 用户菜单
 *   - 底部：扫光横线
 *
 * 用户菜单内置：主题切换（下拉，彩色圆点）+ 全屏切换。
 * 标题、副标题、告警数、地域、天气、用户名均通过 props 传入。
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useUiTheme } from '../../composables/useUiTheme'
import { UI_STYLE_OPTIONS } from '../../types'
import type { UiStyleOption } from '../../types'
import TechAvatar from '../TechAvatar/TechAvatar.vue'
import TechSelect from '../TechSelect/TechSelect.vue'

const props = withDefaults(
  defineProps<{
    /** 主标题 */
    title?: string
    /** 副标题（英文/小字） */
    subtitle?: string
    /** logo 图片地址（不传则显示主题色方块占位） */
    logo?: string
    /** 地域文字（如「珠海·富山」），传空则不显示 */
    region?: string
    /** 天气文字（如「多云 25°C」），传空则不显示 */
    weather?: string
    /** 告警数（铃铛角标，0 则不显示角标） */
    alarmCount?: number
    /** 系统状态文字 */
    systemStatus?: string
    /** 用户名 */
    userName?: string
    /** 是否显示用户菜单（含主题切换/全屏） */
    showUserMenu?: boolean
    /** 是否浮动定位（fixed 贴顶）；false 则随文档流 */
    floating?: boolean
  }>(),
  {
    title: '曜蓝机甲 Tech HUD',
    subtitle: 'TECH HUD · DIGITAL TWIN SYSTEM',
    logo: '',
    region: '',
    weather: '',
    alarmCount: 0,
    systemStatus: '系统运行中',
    userName: '管理员',
    showUserMenu: true,
    floating: false,
  },
)

const emit = defineEmits<{
  /** 点击告警铃铛时触发 */
  (e: 'alarm-click'): void
  /** 切换主题时触发，载荷为主题 id */
  (e: 'theme-change', value: UiStyleOption['id']): void
}>()

// —— 主题切换 ——
const { style, setStyle } = useUiTheme()
const themeOptions = computed(() =>
  UI_STYLE_OPTIONS.map((o) => ({ label: o.name, value: o.id, color: o.color, desc: o.desc })),
)
function onThemeChange(value: string | number) {
  setStyle(value as UiStyleOption['id'])
  emit('theme-change', value as UiStyleOption['id'])
}
function dotStyle(color: unknown) {
  return color ? { background: String(color) } : undefined
}

// —— 实时时钟 ——
const currentTime = ref('')
let timer: ReturnType<typeof setInterval> | null = null
function updateTime() {
  // 文档：zh-CN 年月日时分秒，tabular-nums 等宽（CSS 里设置）
  currentTime.value = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// —— 告警数显示（>99 显示 99+）——
const alarmText = computed(() =>
  props.alarmCount > 99 ? '99+' : String(props.alarmCount),
)

// —— 全屏切换 ——
const isFullscreen = ref(false)
function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}
function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

// —— 用户菜单开关 ——
const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)
function onDocClick(e: MouseEvent) {
  const target = e.target as Element | null
  if (!target) return
  if (userMenuRef.value?.contains(target)) return
  // Teleport 到 body 的菜单点击区域
  if (target.closest('.fzm-app-header__user-menu')) return
  userMenuOpen.value = false
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  document.addEventListener('click', onDocClick)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<template>
  <header class="fzm-app-header" :class="{ 'is-floating': floating }">
    <!-- 左上/右上 HUD 切角标记 -->
    <span class="fzm-app-header__corner tl" />
    <span class="fzm-app-header__corner tr" />

    <div class="fzm-app-header__inner">
      <!-- 左：logo + 渐变标题 -->
      <div class="fzm-app-header__brand">
        <div class="fzm-app-header__logo">
          <img v-if="logo" :src="logo" alt="logo" class="fzm-app-header__logo-img" />
          <span v-else class="fzm-app-header__logo-placeholder" />
        </div>
        <div class="fzm-app-header__title-wrap">
          <h1 class="fzm-app-header__title">{{ title }}</h1>
          <span v-if="subtitle" class="fzm-app-header__subtitle">{{ subtitle }}</span>
        </div>
      </div>

      <!-- 中：电流母线 spacer（脉冲流动 + 旋转菱形锚点） -->
      <div class="fzm-app-header__spacer">
        <span class="fzm-app-header__pulse" />
      </div>

      <!-- 右：状态组 -->
      <div class="fzm-app-header__actions">
        <!-- 自定义前置插槽（额外 chip 等） -->
        <slot name="actions" />

        <!-- 地域 chip（文档：定位 pin 图标，色 #7dd3fc） -->
        <span v-if="region" class="fzm-app-header__chip">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {{ region }}
        </span>
        <!-- 天气 chip（文档：太阳云图标，色 #ecca82） -->
        <span v-if="weather" class="fzm-app-header__chip">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ecca82" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M20 12h2M17.66 6.34l1.41-1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6A3.5 3.5 0 1 1 13 22z"/></svg>
          {{ weather }}
        </span>

        <span class="fzm-app-header__divider" />

        <!-- 系统状态（文档：#2fe6a7 翠绿点 + 双层辉光 + pulseGlow 呼吸） -->
        <div v-if="systemStatus" class="fzm-app-header__status">
          <span class="fzm-app-header__sys-dot" />
          <span class="fzm-app-header__status-text">{{ systemStatus }}</span>
        </div>

        <!-- 告警铃铛（文档：30×30 圆角按钮 + 药丸红徽标）；铃铛常驻，徽标仅在有告警时显示 -->
        <button
          type="button"
          class="fzm-app-header__bell"
          aria-label="告警通知"
          @click="emit('alarm-click')"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span v-if="alarmCount > 0" class="fzm-app-header__bell-badge">{{ alarmText }}</span>
        </button>

        <span class="fzm-app-header__divider" />

        <!-- 时间（文档：时钟图标 #7dd3fc + tabular-nums 等宽数字） -->
        <div class="fzm-app-header__time">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#7dd3fc" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span class="fzm-app-header__time-text">{{ currentTime }}</span>
        </div>

        <!-- 用户菜单 -->
        <div v-if="showUserMenu" ref="userMenuRef" class="fzm-app-header__user">
          <button
            type="button"
            class="fzm-app-header__user-trigger"
            @click="userMenuOpen = !userMenuOpen"
          >
            <TechAvatar :text="userName" :size="26" shape="circle" />
            <span class="fzm-app-header__user-name">{{ userName }}</span>
            <svg
              class="fzm-app-header__user-arrow"
              viewBox="0 0 24 24"
              width="9"
              height="9"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              :style="{ transform: userMenuOpen ? 'rotate(180deg)' : '' }"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <!-- 浮动菜单（Teleport 到 body，避免被 overflow 裁切） -->
          <Teleport to="body">
            <transition name="fzm-app-header-menu">
              <div v-if="userMenuOpen" class="fzm-app-header__user-menu">
                <!-- 主题切换 -->
                <div class="fzm-app-header__menu-row fzm-app-header__menu-row--theme">
                  <span class="fzm-app-header__menu-label">主题风格</span>
                  <TechSelect
                    :model-value="style"
                    :options="themeOptions"
                    class="fzm-app-header__theme-select"
                    @change="onThemeChange"
                  >
                    <template #trigger="{ label }">
                      <span class="fzm-app-header__theme-trigger">
                        <span class="fzm-app-header__theme-dot" :style="dotStyle(UI_STYLE_OPTIONS.find((o) => o.id === style)?.color)" />
                        {{ label || '选择主题' }}
                      </span>
                    </template>
                    <template #option="{ option }">
                      <span class="fzm-app-header__theme-option">
                        <span class="fzm-app-header__theme-dot" :style="dotStyle(option.color)" />
                        <span class="fzm-app-header__theme-name">{{ option.label }}</span>
                        <span class="fzm-app-header__theme-desc">{{ option.desc }}</span>
                      </span>
                    </template>
                  </TechSelect>
                </div>

                <div class="fzm-app-header__menu-sep" />

                <!-- 全屏切换 -->
                <button type="button" class="fzm-app-header__menu-row" @click="toggleFullscreen">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path v-if="!isFullscreen" d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    <path v-else d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                  </svg>
                  <span class="fzm-app-header__menu-label">全屏模式</span>
                  <span class="fzm-app-header__switch" :class="{ on: isFullscreen }">
                    <span class="fzm-app-header__switch-dot" />
                  </span>
                </button>

                <!-- 自定义菜单项插槽 -->
                <slot name="menu" />
              </div>
            </transition>
          </Teleport>
        </div>
      </div>
    </div>

    <!-- 底部渐变线 -->
    <div class="fzm-app-header__accent" />
  </header>
</template>

<style scoped>
/* 基底与 TechCard 统一：bg-card 深蓝青渐变 + border-color + shadow-card
   这些变量随主题切换自动联动（深色主题深蓝青，白色主题反转浅色） */
.fzm-app-header {
  position: relative;
  display: flex;
  flex-direction: column;
  height: var(--header-h);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  z-index: 10;
}

/* 浮动模式：fixed 贴顶，边缘留白 */
.fzm-app-header.is-floating {
  position: fixed;
  top: 10px;
  left: 10px;
  right: 10px;
  z-index: 50;
  clip-path: polygon(
    var(--notch) 0,
    100% 0,
    100% calc(100% - var(--notch)),
    calc(100% - var(--notch)) 100%,
    0 100%,
    0 var(--notch)
  );
}

.fzm-app-header__inner {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 18px 0 16px;
  min-height: 0;
}

/* —— HUD 切角标记（文档：18×18，距顶/侧 6px） —— */
.fzm-app-header__corner {
  position: absolute;
  width: 18px;
  height: 18px;
  pointer-events: none;
  z-index: 2;
}

.fzm-app-header__corner.tl {
  top: 6px;
  left: 6px;
  border-top: 2px solid rgb(var(--primary-rgb) / 0.7);
  border-left: 2px solid rgb(var(--primary-rgb) / 0.7);
  filter: drop-shadow(0 0 4px rgb(var(--primary-rgb) / 0.5));
}

.fzm-app-header__corner.tr {
  top: 6px;
  right: 6px;
  border-top: 2px solid rgb(var(--primary-rgb) / 0.7);
  border-right: 2px solid rgb(var(--primary-rgb) / 0.7);
  filter: drop-shadow(0 0 4px rgb(var(--primary-rgb) / 0.5));
}

/* —— 左：logo + 标题 —— */
.fzm-app-header__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.fzm-app-header__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
}

.fzm-app-header__logo-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.fzm-app-header__logo-placeholder {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: var(--primary-gradient);
  box-shadow: var(--shadow-glow-blue);
}

.fzm-app-header__title-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.1;
}

.fzm-app-header__title {
  margin: 0;
  font-size: 19px;
  font-weight: 900;
  letter-spacing: 3px;
  /* 渐变文字：白 → 主题浅色（文档 #8fc3d4 即 primary-light） */
  background: linear-gradient(135deg, #ffffff 0%, var(--primary-light) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
}

.fzm-app-header__subtitle {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 2.5px;
  color: var(--accent-light);
  opacity: 0.7;
  white-space: nowrap;
}

/* —— 中：电流母线 spacer（机甲能量管线） —— */
.fzm-app-header__spacer {
  flex: 1 1 auto;
  height: 2px;
  margin: 0 8px;
  position: relative;
  overflow: visible;
  /* 底层：机械刻度纹理 + 渐变母线（电流母线感） */
  background:
    repeating-linear-gradient(90deg, rgb(var(--primary-rgb) / 0.45) 0 2px, transparent 2px 9px),
    linear-gradient(90deg, rgb(var(--primary-rgb) / 0.5) 0%, rgb(var(--primary-rgb) / 0.1) 50%, transparent 100%);
  box-shadow: 0 0 8px rgb(var(--primary-rgb) / 0.3);
}

/* 流动电流脉冲（主题色脉冲 + 双层强辉光，随主题切换） */
.fzm-app-header__pulse {
  position: absolute;
  top: 50%;
  left: 0;
  width: 72px;
  height: 3px;
  transform: translateY(-50%);
  background: linear-gradient(90deg, transparent, var(--primary-light) 50%, transparent);
  box-shadow: 0 0 10px rgb(var(--primary-rgb) / 0.85), 0 0 22px rgb(var(--primary-rgb) / 0.4);
  animation: fzm-header-flow 3.2s linear infinite;
}

@keyframes fzm-header-flow {
  0% { left: -15%; opacity: 0; }
  12% { opacity: 1; }
  88% { opacity: 1; }
  100% { left: 92%; opacity: 0; }
}

/* 虚线轨道：贴在母线下方，形成能量管线导轨感（用渐变模拟虚线，可控间距） */
.fzm-app-header__spacer::before {
  content: '';
  position: absolute;
  left: 0;
  right: 12px;
  top: calc(100% - 1.5px);
  height: 1px;
  background-image: repeating-linear-gradient(90deg, var(--accent) 0 6px, transparent 6px 12px);
}

/* 右端旋转菱形锚点（空心锁定标记） */
.fzm-app-header__spacer::after {
  content: '';
  position: absolute;
  right: 2px;
  top: 50%;
  width: 9px;
  height: 9px;
  border: 1.5px solid var(--accent);
  background: transparent;
  transform: translateY(-50%) rotate(45deg);
  box-shadow: 0 0 6px rgb(var(--accent-rgb) / 0.7), inset 0 0 4px rgb(var(--accent-rgb) / 0.5);
  animation: fzm-header-spin 4s linear infinite;
}

@keyframes fzm-header-spin {
  from { transform: translateY(-50%) rotate(45deg); }
  to { transform: translateY(-50%) rotate(405deg); }
}

/* 用户偏好减少动效时，关闭所有装饰性动画 */
@media (prefers-reduced-motion: reduce) {
  .fzm-app-header__pulse,
  .fzm-app-header__spacer::after,
  .fzm-app-header__sys-dot {
    animation: none;
  }
}

/* —— 右：状态组 —— */
.fzm-app-header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* 地域/天气 chip（文档：切角小标签，11px） */
.fzm-app-header__chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 22px;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
  background: rgb(var(--primary-rgb) / 0.14);
  border: 1px solid rgb(var(--primary-rgb) / 0.3);
  border-radius: var(--radius-sm);
  clip-path: polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%);
}

.fzm-app-header__divider {
  width: 1px;
  height: 16px;
  background: rgb(var(--primary-rgb) / 0.2);
  flex-shrink: 0;
}

/* 系统状态点（文档：#2fe6a7 翠绿 + 双层辉光 + pulseGlow 呼吸） */
.fzm-app-header__status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.fzm-app-header__sys-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2fe6a7;
  box-shadow:
    0 0 0 3px rgba(47, 230, 167, 0.18),
    0 0 8px rgba(47, 230, 167, 0.7);
  animation: fzm-header-pulse 2s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes fzm-header-pulse {
  0%, 100% {
    box-shadow:
      0 0 0 3px rgba(47, 230, 167, 0.18),
      0 0 8px rgba(47, 230, 167, 0.7);
  }
  50% {
    box-shadow:
      0 0 0 3px rgba(47, 230, 167, 0.28),
      0 0 12px rgba(47, 230, 167, 0.9);
  }
}

.fzm-app-header__status-text {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
}

/* 告警铃铛（文档：30×30 圆角按钮） */
.fzm-app-header__bell {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  color: var(--text-secondary);
  background: rgb(var(--primary-rgb) / 0.06);
  border: 1px solid rgb(var(--primary-rgb) / 0.12);
  cursor: pointer;
  transition: all 0.2s ease;
}

.fzm-app-header__bell:hover {
  color: var(--primary-light);
  border-color: rgb(var(--primary-rgb) / 0.45);
}

/* 铃铛徽标（文档：药丸形，主题危险色 + 红投影） */
.fzm-app-header__bell-badge {
  position: absolute;
  top: -6px;
  right: -7px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--danger);
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgb(var(--danger-rgb) / 0.55);
}

/* 时间（文档：tabular-nums 等宽数字，不抖动） */
.fzm-app-header__time {
  display: flex;
  align-items: center;
  gap: 6px;
}

.fzm-app-header__time-text {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  white-space: nowrap;
}

/* 用户触发器 */
.fzm-app-header__user {
  position: relative;
}

.fzm-app-header__user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 3px 8px 3px 3px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.fzm-app-header__user-trigger:hover {
  border-color: rgb(var(--primary-rgb) / 0.35);
  background: rgb(var(--primary-rgb) / 0.08);
}

.fzm-app-header__user-name {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
}

.fzm-app-header__user-arrow {
  color: var(--text-muted);
  transition: transform 0.2s ease;
}

/* —— 用户浮层菜单（文档：fixed 定位，top = header 高度 + 间距，right 贴右） —— */
.fzm-app-header__user-menu {
  position: fixed;
  /* 文档：top: calc(var(--header-h) + 16px)，right: 20px
     Teleport 到 body 后需用 fixed + 绝对坐标，否则位置错乱 */
  top: calc(var(--header-h) + 30px);
  right: 20px;
  z-index: 80;
  min-width: 200px;
  padding: 6px;
  /* 文档：强制深蓝实底渐变，保证菜单在任何主题下都清晰 */
  background: linear-gradient(180deg, rgba(8, 44, 76, 1), rgba(4, 26, 48, 1));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgb(var(--primary-rgb) / 0.4);
  border-radius: var(--radius-md);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 0 16px rgb(var(--primary-rgb) / 0.18);
}

/* 菜单行 */
.fzm-app-header__menu-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s ease;
}

.fzm-app-header__menu-row:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.fzm-app-header__menu-label {
  flex: 1;
  text-align: left;
}

/* 主题切换行：内嵌 TechSelect */
.fzm-app-header__menu-row--theme {
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
  cursor: default;
}

.fzm-app-header__menu-row--theme:hover {
  background: transparent;
  color: var(--text-secondary);
}

.fzm-app-header__theme-select {
  width: 100%;
}

.fzm-app-header__theme-trigger {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.fzm-app-header__theme-option {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
}

.fzm-app-header__theme-name {
  font-weight: 600;
  flex-shrink: 0;
}

.fzm-app-header__theme-desc {
  margin-left: auto;
  font-size: 10px;
  font-weight: 400;
  color: var(--text-muted);
  opacity: 0.7;
}

.fzm-app-header__theme-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.fzm-app-header__menu-sep {
  height: 1px;
  margin: 4px 6px;
  background: rgb(var(--primary-rgb) / 0.15);
}

/* 开关（文档：开启态渐变 #4a8a9e→#5fa8bd + 青辉光） */
.fzm-app-header__switch {
  position: relative;
  width: 28px;
  height: 15px;
  border-radius: 999px;
  background: rgba(140, 195, 210, 0.18);
  border: 1px solid rgba(140, 195, 210, 0.25);
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.fzm-app-header__switch.on {
  background: linear-gradient(90deg, #4a8a9e, #5fa8bd);
  border-color: rgba(130, 188, 204, 0.7);
  box-shadow: 0 0 10px rgba(20, 190, 240, 0.55);
}

.fzm-app-header__switch-dot {
  position: absolute;
  top: 1.5px;
  left: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s ease;
}

.fzm-app-header__switch.on .fzm-app-header__switch-dot {
  transform: translateX(13px);
}

/* 菜单过渡 */
.fzm-app-header-menu-enter-active,
.fzm-app-header-menu-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fzm-app-header-menu-enter-from,
.fzm-app-header-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* —— 底部渐变线 —— */
.fzm-app-header__accent {
  position: relative;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgb(var(--primary-rgb) / 0.65) 30%,
    var(--primary) 50%,
    rgb(var(--primary-rgb) / 0.65) 70%,
    transparent 100%
  );
}
</style>
