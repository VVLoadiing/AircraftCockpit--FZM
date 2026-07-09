<script setup lang="ts">
/**
 * TechScroll — 科技风滚动容器
 *
 * 三大能力（各自独立开关，可组合）：
 *  1. 自定义简洁滚动条（scrollbar: always / hover / none）
 *  2. 滚动加载（loadMore）：滚到底部阈值 emit('load-more')，父组件请求并追加数据
 *  3. 无缝循环匀速自动滚动（autoScroll）：内容双份衔接，requestAnimationFrame 驱动
 *
 * 自动滚动为展示型（公告/状态流），load-more 为交互型，二者一般不同时开启。
 */
import { ref, onMounted, onBeforeUnmount, watch, nextTick, useSlots, computed } from 'vue'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.vue'

const props = withDefaults(
  defineProps<{
    /** 容器高度（如 '200px'、'100%'） */
    height?: string
    /** 是否开启无缝循环匀速自动滚动 */
    autoScroll?: boolean
    /** 自动滚动速度（px/秒） */
    speed?: number
    /** 自动滚动时鼠标悬停是否暂停 */
    pauseOnHover?: boolean
    /** 是否开启滚动到底部加载（emit load-more） */
    loadMore?: boolean
    /** 父组件加载中状态（true 时底部显示 loading 且不重复触发 load-more） */
    loading?: boolean
    /** 触发 load-more 的距离阈值（px，距底部多近时触发） */
    loadDistance?: number
    /** 自定义滚动条显隐模式 */
    scrollbar?: 'always' | 'hover' | 'none'
  }>(),
  {
    height: '200px',
    autoScroll: false,
    speed: 40,
    pauseOnHover: true,
    loadMore: false,
    loading: false,
    loadDistance: 40,
    scrollbar: 'hover',
  },
)

const emit = defineEmits<{
  /** 滚动到底部阈值时触发（需 loadMore=true） */
  (e: 'load-more'): void
  /** 滚动时触发，传出进度信息 */
  (e: 'scroll', payload: { scrollTop: number; progress: number }): void
}>()

const slots = useSlots()
/** 是否有自定义 loading 插槽 */
const hasLoadingSlot = computed(() => !!slots.loading)

const viewportRef = ref<HTMLDivElement | null>(null)
/** 自动滚动时，包裹双份内容做位移的容器 */
const trackRef = ref<HTMLDivElement | null>(null)

/* ============ 1. 滚动加载 ============ */
/** load-more 节流：一次触底只 emit 一次，直到 loading 结束 */
function handleScroll() {
  const el = viewportRef.value
  if (!el) return

  // 自动滚动模式下不处理 load-more（位移由 track 控制，scrollTop 恒为 0）
  if (props.autoScroll) return

  const { scrollTop, scrollHeight, clientHeight } = el
  emit('scroll', {
    scrollTop,
    progress: scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0,
  })

  if (!props.loadMore || props.loading) return
  if (scrollTop + clientHeight >= scrollHeight - props.loadDistance) {
    emit('load-more')
  }
}

/* ============ 2. 无缝循环自动滚动 ============ */
let rafId = 0
/** 当前位移（track 的 translateY 像素值） */
let offset = 0
/** 上一帧时间戳（计算帧间 delta，保证匀速） */
let lastTs = 0
/** 鼠标是否悬停（pauseOnHover 用） */
const hovering = ref(false)
/** 单份内容高度（track 总高的一半，到达此值即重置回 0 实现无缝） */
let halfHeight = 0

function measureHalfHeight() {
  if (!trackRef.value) return
  // track 内有两份相同内容，单份高度 = scrollHeight / 2
  halfHeight = trackRef.value.scrollHeight / 2
}

function tick(ts: number) {
  if (!lastTs) lastTs = ts
  const delta = ts - lastTs
  lastTs = ts

  // pauseOnHover：悬停时不前进
  const paused = props.pauseOnHover && hovering.value
  if (!paused && halfHeight > 0) {
    // 像素位移 = 速度(px/秒) × 帧时长(秒)
    offset += (props.speed * delta) / 1000
    // 到达单份高度，无缝重置回 0（视觉连续，因第二份与第一份相同）
    if (offset >= halfHeight) offset -= halfHeight
    if (trackRef.value) trackRef.value.style.transform = `translateY(${-offset}px)`
  }
  rafId = requestAnimationFrame(tick)
}

function startAuto() {
  stopAuto()
  offset = 0
  lastTs = 0
  if (trackRef.value) trackRef.value.style.transform = 'translateY(0)'
  // 等待 DOM 更新后测量（双份内容渲染完成）
  nextTick(() => {
    measureHalfHeight()
    rafId = requestAnimationFrame(tick)
  })
}

function stopAuto() {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
}

function onEnter() {
  hovering.value = true
}
function onLeave() {
  hovering.value = false
}

/* ============ 生命周期 ============ */
onMounted(() => {
  if (props.autoScroll) startAuto()
})

onBeforeUnmount(() => {
  stopAuto()
})

// 自动滚动开关变化
watch(
  () => props.autoScroll,
  (v) => {
    if (v) startAuto()
    else stopAuto()
  },
)

// 速度变化无需重启（tick 内实时读取 props.speed）
// 内容变化后重新测量单份高度（autoScroll 场景，保证无缝点正确）
watch(
  () => slots.default?.(),
  () => {
    if (props.autoScroll) nextTick(measureHalfHeight)
  },
)

defineExpose({
  /** 手动滚动到顶部 */
  scrollToTop() {
    const el = viewportRef.value
    if (el && !props.autoScroll) el.scrollTo({ top: 0 })
  },
  /** 手动滚动到底部 */
  scrollToBottom() {
    const el = viewportRef.value
    if (el && !props.autoScroll) el.scrollTo({ top: el.scrollHeight })
  },
})
</script>

<template>
  <div
    class="fzm-scroll"
    :class="[`is-scrollbar-${scrollbar}`, { 'is-auto': autoScroll }]"
    :style="{ height }"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <!-- 自动滚动模式：用 track 包裹双份内容做位移；普通模式用 viewport 滚动 -->
    <div v-if="autoScroll" ref="trackRef" class="fzm-scroll__track">
      <div class="fzm-scroll__content">
        <slot />
      </div>
      <!-- 第二份（无缝衔接）：aria-hidden 避免读屏重复 -->
      <div class="fzm-scroll__content" aria-hidden="true">
        <slot />
      </div>
    </div>

    <div v-else ref="viewportRef" class="fzm-scroll__viewport" @scroll.passive="handleScroll">
      <div class="fzm-scroll__content">
        <slot />
      </div>
      <!-- 滚动加载：底部 loading 提示 -->
      <div v-if="loadMore && loading" class="fzm-scroll__loading">
        <slot v-if="hasLoadingSlot" name="loading" />
        <LoadingSpinner v-else text="加载中" :size="22" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fzm-scroll {
  position: relative;
  width: 100%;
  overflow: hidden; /* 裁切是位移/滚动的视觉边界 */
}

/* —— 普通滚动视口 —— */
.fzm-scroll__viewport {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.fzm-scroll__content {
  /* 内容区不强制布局，由使用者控制（列表/卡片/自定义） */
}

/* —— 自动滚动 track（双份内容，整体上移） —— */
.fzm-scroll__track {
  will-change: transform;
}

/* —— 加载提示 —— */
.fzm-scroll__loading {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

/* ============ 自定义滚动条 ============ */
/*
 * 比全局更细（3px）、默认 hover 才显隐；由 scrollbar prop 通过 is-scrollbar-xxx 控制。
 * Firefox 用 scrollbar-width/color 兜底（none 模式置 0/透明）。
 */

/* always：常驻 */
.is-scrollbar-always .fzm-scroll__viewport {
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--primary-rgb) / 0.45) rgba(255, 255, 255, 0.04);
}

/* hover：默认隐藏，容器悬停时显示 */
.is-scrollbar-hover .fzm-scroll__viewport {
  scrollbar-width: none; /* Firefox：默认隐藏，hover 时无法切换 thin，接受无滚动条 */
}
.is-scrollbar-hover .fzm-scroll__viewport::-webkit-scrollbar {
  width: 3px;
  height: 3px;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.is-scrollbar-hover:hover .fzm-scroll__viewport::-webkit-scrollbar {
  opacity: 1;
}
.is-scrollbar-hover .fzm-scroll__viewport::-webkit-scrollbar-track {
  background: transparent;
}
.is-scrollbar-hover .fzm-scroll__viewport::-webkit-scrollbar-thumb {
  background: rgb(var(--primary-rgb) / 0.45);
  border-radius: 4px;
}

/* none：完全隐藏 */
.is-scrollbar-none .fzm-scroll__viewport {
  scrollbar-width: none;
}
.is-scrollbar-none .fzm-scroll__viewport::-webkit-scrollbar {
  display: none;
}

/* 自动滚动模式：不需要滚动条（位移由 track 控制） */
.is-auto .fzm-scroll__viewport {
  scrollbar-width: none;
}
.is-auto .fzm-scroll__viewport::-webkit-scrollbar {
  display: none;
}

/* always 模式的 webkit 细滚动条（3px，主题色渐变） */
.is-scrollbar-always .fzm-scroll__viewport::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}
.is-scrollbar-always .fzm-scroll__viewport::-webkit-scrollbar-track {
  background: transparent;
}
.is-scrollbar-always .fzm-scroll__viewport::-webkit-scrollbar-thumb {
  background: linear-gradient(
    180deg,
    rgb(var(--primary-rgb) / 0.5),
    rgb(var(--accent-rgb) / 0.5)
  );
  border-radius: 4px;
}
.is-scrollbar-always .fzm-scroll__viewport::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    180deg,
    rgb(var(--primary-rgb) / 0.75),
    rgb(var(--accent-rgb) / 0.75)
  );
}
</style>
