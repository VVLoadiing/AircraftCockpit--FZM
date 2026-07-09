<script setup lang="ts">
/**
 * TechDialog — 科技风对话框
 *
 * 基于 FzGlass 的黑色玻璃浮窗视觉（深黑透明 + 强模糊 + 青色辉光 + 顶部扫光），
 * 叠加遮罩层、ESC 关闭、点遮罩关闭、确认/取消按钮、进出过渡动画。
 *
 * 用法：v-model:visible 双向绑定控制显隐。
 */
import { watch, onBeforeUnmount, useSlots, computed } from 'vue'
import FzGlassClose from '../FzGlass/FzGlassClose.vue'
import HudButton from '../HudButton/HudButton.vue'

const props = withDefaults(
  defineProps<{
    /** 是否显示（v-model:visible） */
    visible: boolean
    /** 标题 */
    title?: string
    /** 宽度（如 '420px'、'80%'） */
    width?: string
    /** 是否显示关闭按钮（右上角） */
    closable?: boolean
    /** 是否点击遮罩层关闭 */
    closeOnOverlay?: boolean
    /** 是否按 ESC 关闭 */
    closeOnEsc?: boolean
    /** 是否显示底部确认/取消按钮区 */
    showFooter?: boolean
    /** 确认按钮文字 */
    confirmText?: string
    /** 取消按钮文字 */
    cancelText?: string
    /** 确认按钮是否加载中（异步提交时防止重复点击） */
    confirmLoading?: boolean
    /** 是否禁用确认按钮 */
    confirmDisabled?: boolean
    /** 底部按钮对齐方式 */
    footerAlign?: 'left' | 'center' | 'right'
  }>(),
  {
    title: '',
    width: '440px',
    closable: true,
    closeOnOverlay: true,
    closeOnEsc: true,
    showFooter: false,
    confirmText: '确认',
    cancelText: '取消',
    confirmLoading: false,
    confirmDisabled: false,
    footerAlign: 'right',
  },
)

const emit = defineEmits<{
  /** v-model:visible 更新 */
  (e: 'update:visible', val: boolean): void
  /** 点击确认按钮 */
  (e: 'confirm'): void
  /** 点击取消按钮 */
  (e: 'cancel'): void
  /** 关闭（任意方式关闭均触发：遮罩/ESC/关闭按钮/取消按钮） */
  (e: 'close'): void
}>()

const slots = useSlots()
const hasHeaderSlot = computed(() => !!slots.header)
const hasFooterSlot = computed(() => !!slots.footer)

/** 关闭对话框（统一出口，触发 close 事件 + 更新 v-model） */
function close() {
  if (!props.visible) return
  emit('update:visible', false)
  emit('close')
}

function onOverlayClick() {
  if (props.closeOnOverlay) close()
}

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  emit('cancel')
  close()
}

/* —— ESC 键关闭 —— */
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.visible) {
    e.preventDefault()
    close()
  }
}

watch(
  () => props.visible,
  (v) => {
    if (v) {
      document.addEventListener('keydown', onKeydown)
      // 打开时锁定 body 滚动
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = ''
    }
  },
)

// 组件卸载前清理监听与样式，避免泄漏
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Transition name="fzm-dialog">
    <div v-if="visible" class="fzm-dialog" @click.self="onOverlayClick">
      <div class="fzm-dialog__panel" :style="{ width }" role="dialog" aria-modal="true">
        <!-- 顶部扫光（机甲仪表感） -->
        <span class="fzm-dialog__scanline" />

        <!-- 关闭按钮 -->
        <button
          v-if="closable"
          type="button"
          class="fzm-dialog__close"
          aria-label="关闭"
          @click="close"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <!-- 标题区（具名 header 插槽或 title prop） -->
        <header v-if="title || hasHeaderSlot" class="fzm-dialog__header">
          <slot name="header">
            <span class="fzm-dialog__title-bar" />
            <h3 class="fzm-dialog__title">{{ title }}</h3>
          </slot>
        </header>

        <!-- 内容区 -->
        <div class="fzm-dialog__body">
          <slot />
        </div>

        <!-- 底部按钮区（具名 footer 插槽或内置确认/取消） -->
        <footer
          v-if="showFooter || hasFooterSlot"
          class="fzm-dialog__footer"
          :class="`is-${footerAlign}`"
        >
          <slot name="footer">
            <HudButton @click="onCancel">{{ cancelText }}</HudButton>
            <HudButton type="primary" :disabled="confirmDisabled" @click="onConfirm">
              {{ confirmText }}
            </HudButton>
          </slot>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* —— 遮罩层 —— */
.fzm-dialog {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  /* 半透黑遮罩 + 背景模糊，聚焦对话框 */
  background: rgba(0, 4, 10, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* —— 对话框面板（复用 FzGlass 的黑色玻璃视觉） —— */
.fzm-dialog__panel {
  position: relative;
  max-width: calc(100vw - 48px);
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--glass-radius);
  color: var(--text-primary);
  background: var(--glass-bg);
  border: var(--glass-border);
  backdrop-filter: var(--glass-blur-strong);
  -webkit-backdrop-filter: var(--glass-blur-strong);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.6),
    var(--glass-shadow);
}

/* 顶部 1px 扫光高光（机甲仪表感） */
.fzm-dialog__scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent 8%,
    rgb(var(--primary-rgb) / 0.6) 50%,
    transparent 92%
  );
}

/* —— 关闭按钮 —— */
.fzm-dialog__close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  width: 22px;
  height: 22px;
  border-radius: 7px;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.18s ease;
  padding: 0;
}

.fzm-dialog__close:hover {
  color: #fff;
  background: rgb(var(--danger-rgb) / 0.28);
  border-color: rgb(var(--danger-rgb) / 0.55);
}

/* —— 标题区 —— */
.fzm-dialog__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--border-light);
}

.fzm-dialog__title-bar {
  width: 3px;
  height: 16px;
  border-radius: 2px;
  background: linear-gradient(180deg, var(--primary), var(--primary-dark));
  box-shadow: 0 0 8px rgb(var(--primary-rgb) / 0.7);
  flex-shrink: 0;
}

.fzm-dialog__title {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--text-primary);
  text-shadow: 0 0 12px rgb(var(--primary-rgb) / 0.45);
}

/* —— 内容区 —— */
.fzm-dialog__body {
  flex: 1;
  min-height: 0;
  padding: 18px 20px;
  font-size: 13px;
  line-height: 1.75;
  color: var(--text-secondary);
  overflow-y: auto;
  scrollbar-width: thin;
}

/* —— 底部按钮区 —— */
.fzm-dialog__footer {
  display: flex;
  gap: 10px;
  padding: 12px 20px 16px;
  border-top: 1px solid var(--border-light);
}

.fzm-dialog__footer.is-right {
  justify-content: flex-end;
}
.fzm-dialog__footer.is-left {
  justify-content: flex-start;
}
.fzm-dialog__footer.is-center {
  justify-content: center;
}

/* —— 进出过渡动画（缩放 + 淡入淡出） —— */
.fzm-dialog-enter-active,
.fzm-dialog-leave-active {
  transition: opacity 0.22s ease;
}
.fzm-dialog-enter-active .fzm-dialog__panel,
.fzm-dialog-leave-active .fzm-dialog__panel {
  transition:
    transform 0.26s cubic-bezier(0.34, 1.36, 0.64, 1),
    opacity 0.22s ease;
}

.fzm-dialog-enter-from,
.fzm-dialog-leave-to {
  opacity: 0;
}
.fzm-dialog-enter-from .fzm-dialog__panel,
.fzm-dialog-leave-to .fzm-dialog__panel {
  /* 轻微回弹缩放（overshoot 曲线） */
  transform: scale(0.92) translateY(8px);
  opacity: 0;
}
</style>
