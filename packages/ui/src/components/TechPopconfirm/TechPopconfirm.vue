<script setup lang="ts">
/**
 * TechPopconfirm — 气泡确认框
 *
 * 点击触发元素（默认插槽）弹出小气泡确认框：标题 + 确认/取消按钮。
 * 轻量、不遮挡（不像 Dialog 那样有遮罩），适合删除/危险操作的二次确认。
 *
 * 气泡用 Teleport 到 body 渲染，避免被父级 overflow 裁切；
 * 点击气泡外部 / ESC / 取消按钮 均可关闭。
 */
import { ref, nextTick, onBeforeUnmount, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 标题（确认提示文案） */
    title: string
    /** 确认按钮文字 */
    confirmText?: string
    /** 取消按钮文字 */
    cancelText?: string
    /** 确认按钮类型（危险操作可用 danger） */
    confirmType?: 'primary' | 'danger'
    /** 气泡弹出方位 */
    placement?: 'top' | 'bottom'
    /** 是否禁用（禁用时不弹出） */
    disabled?: boolean
  }>(),
  {
    confirmText: '确认',
    cancelText: '取消',
    confirmType: 'primary',
    placement: 'top',
    disabled: false,
  },
)

const emit = defineEmits<{
  /** 点击确认 */
  (e: 'confirm'): void
  /** 点击取消 */
  (e: 'cancel'): void
}>()

const visible = ref(false)
/** 触发元素引用 */
const triggerRef = ref<HTMLElement | null>(null)
/** 气泡元素引用 */
const popoverRef = ref<HTMLElement | null>(null)
/** 气泡定位坐标 */
const pos = ref({ left: 0, top: 0 })

/** 计算气泡定位（基于触发元素位置 + placement） */
function updatePos() {
  const trigger = triggerRef.value
  if (!trigger) return
  const rect = trigger.getBoundingClientRect()
  // 水平居中对齐触发元素
  pos.value.left = rect.left + rect.width / 2
  // 垂直方位
  if (props.placement === 'top') {
    pos.value.top = rect.top - 10 // 气泡在上方，间距 10px（实际再由 translateX/Y 调整）
  } else {
    pos.value.top = rect.bottom + 10
  }
}

async function show() {
  if (props.disabled || visible.value) return
  visible.value = true
  await nextTick()
  updatePos()
  // 下一帧再注册 outside 监听，避免触发本次点击立即关闭
  requestAnimationFrame(() => {
    document.addEventListener('click', onOutsideClick, true)
    document.addEventListener('keydown', onEsc)
    window.addEventListener('resize', updatePos)
    window.addEventListener('scroll', updatePos, true)
  })
}

function hide() {
  visible.value = false
  document.removeEventListener('click', onOutsideClick, true)
  document.removeEventListener('keydown', onEsc)
  window.removeEventListener('resize', updatePos)
  window.removeEventListener('scroll', updatePos, true)
}

/** 点击外部关闭：若点击点不在触发元素和气泡内，则关闭 */
function onOutsideClick(e: MouseEvent) {
  const target = e.target as Node
  if (
    triggerRef.value?.contains(target) ||
    popoverRef.value?.contains(target)
  ) {
    return
  }
  hide()
}

function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') hide()
}

function onConfirm() {
  emit('confirm')
  hide()
}
function onCancel() {
  emit('cancel')
  hide()
}

// 点击触发元素切换显隐
function onTriggerClick() {
  if (visible.value) hide()
  else show()
}

watch(visible, (v) => {
  if (!v) {
    document.removeEventListener('click', onOutsideClick, true)
    document.removeEventListener('keydown', onEsc)
    window.removeEventListener('resize', updatePos)
    window.removeEventListener('scroll', updatePos, true)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onOutsideClick, true)
  document.removeEventListener('keydown', onEsc)
  window.removeEventListener('resize', updatePos)
  window.removeEventListener('scroll', updatePos, true)
})
</script>

<template>
  <!-- 触发元素（默认插槽），点击切换气泡 -->
  <span ref="triggerRef" class="fzm-popconfirm__trigger" @click="onTriggerClick">
    <slot />
  </span>

  <!-- 气泡：Teleport 到 body 避免被 overflow 裁切 -->
  <Teleport to="body">
    <Transition name="fzm-popconfirm">
      <div
        v-if="visible"
        ref="popoverRef"
        class="fzm-popconfirm"
        :class="`is-${placement}`"
        :style="{
          left: pos.left + 'px',
          top: pos.top + 'px',
        }"
        role="dialog"
        @click.stop
      >
        <!-- 小三角箭头 -->
        <span class="fzm-popconfirm__arrow" />

        <!-- 标题 -->
        <p class="fzm-popconfirm__title">{{ title }}</p>

        <!-- 按钮区 -->
        <div class="fzm-popconfirm__actions">
          <button type="button" class="fzm-popconfirm__btn" @click="onCancel">
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="fzm-popconfirm__btn fzm-popconfirm__btn--confirm"
            :class="`is-${confirmType}`"
            @click="onConfirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fzm-popconfirm__trigger {
  display: inline-flex;
}

/* —— 气泡 —— */
.fzm-popconfirm {
  position: fixed;
  z-index: 1500;
  /* translateX(-50%) 水平居中；top/bottom 方位由 inline top 值决定 */
  transform: translateX(-50%);
  min-width: 200px;
  max-width: 280px;
  padding: 12px 14px;
  /* 跟随主题实底（深色主题=深蓝，浅色主题=白），文字始终高对比 */
  background: var(--bg-card-strong);
  border: 1px solid rgb(var(--primary-rgb) / 0.38);
  border-radius: var(--radius-md);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.28),
    0 0 16px rgb(var(--primary-rgb) / 0.14);
  /* 切角呼应科技风 */
  clip-path: polygon(
    var(--notch) 0,
    100% 0,
    100% calc(100% - var(--notch)),
    calc(100% - var(--notch)) 100%,
    0 100%,
    0 var(--notch)
  );
}

/* 方位微调：top 时气泡向上偏移自身高度（通过 translateY） */
.fzm-popconfirm.is-top {
  transform: translateX(-50%) translateY(-100%);
}
.fzm-popconfirm.is-bottom {
  transform: translateX(-50%);
}

/* 小三角箭头（背景跟随主题，与气泡底色一致） */
.fzm-popconfirm__arrow {
  position: absolute;
  left: 50%;
  width: 10px;
  height: 10px;
  background: var(--bg-card-strong);
  border-right: 1px solid rgb(var(--primary-rgb) / 0.38);
  border-bottom: 1px solid rgb(var(--primary-rgb) / 0.38);
  transform: translateX(-50%) rotate(45deg);
}
.is-top .fzm-popconfirm__arrow {
  bottom: -6px;
  transform: translateX(-50%) rotate(45deg);
}
.is-bottom .fzm-popconfirm__arrow {
  top: -6px;
  transform: translateX(-50%) rotate(-135deg);
}

.fzm-popconfirm__title {
  margin: 0 0 12px;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-primary);
}

/* —— 按钮区 —— */
.fzm-popconfirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.fzm-popconfirm__btn {
  padding: 4px 14px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: inherit;
}

.fzm-popconfirm__btn:hover {
  color: var(--text-primary);
  border-color: var(--border-strong);
}

.fzm-popconfirm__btn--confirm.is-primary {
  color: var(--text-on-primary);
  background: var(--primary-gradient);
  border-color: transparent;
  box-shadow: 0 0 10px rgb(var(--primary-rgb) / 0.4);
}

.fzm-popconfirm__btn--confirm.is-danger {
  /* 实底红（不透明），保证红底白字在任意主题下都高对比清晰 */
  color: #fff;
  background: linear-gradient(180deg, var(--danger), var(--danger));
  border: 1px solid var(--danger);
  box-shadow: 0 0 10px rgb(var(--danger-rgb) / 0.4);
}

/* —— 进出过渡 —— */
.fzm-popconfirm-enter-active,
.fzm-popconfirm-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.36, 0.64, 1);
}
.fzm-popconfirm-enter-from,
.fzm-popconfirm-leave-to {
  opacity: 0;
}
.is-top.fzm-popconfirm-enter-from,
.is-top.fzm-popconfirm-leave-to {
  transform: translateX(-50%) translateY(-100%) translateY(8px);
}
.is-bottom.fzm-popconfirm-enter-from,
.is-bottom.fzm-popconfirm-leave-to {
  transform: translateX(-50%) translateY(-8px);
}
</style>
