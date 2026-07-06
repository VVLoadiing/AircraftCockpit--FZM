<script setup lang="ts">
/**
 * BaseChart — ECharts 自适应封装
 * 来源：UI设计系统规范.md 第 10.5 节
 *
 * 封装 init / setOption / ResizeObserver / dispose，
 * 配合 .fzm-chart-fill（见本组件样式）实现容器自适应。
 *
 * 注意：echarts 为可选 peerDependency。使用本组件前需自行安装 echarts。
 * 本组件用动态 import() 引入 echarts，避免在未安装时报错。
 *
 * 关键：ECharts 初始化要求容器有非零宽高。本组件会在容器获得真实
 * 尺寸后才 init，避免 "Can't get DOM width or height" 警告。
 */
import { ref, shallowRef, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import type { EChartsOption } from 'echarts'

const props = withDefaults(
  defineProps<{
    /** ECharts option */
    option: EChartsOption
    /** 宽度 */
    width?: string
    /** 高度 */
    height?: string
    /** 是否在 option 变化时 notMerge（默认 true，整体替换） */
    notMerge?: boolean
  }>(),
  {
    width: '100%',
    height: '100%',
    notMerge: true,
  },
)

const chartRef = ref<HTMLDivElement | null>(null)
// 用 shallowRef 持有 echarts 实例与 RO（非响应式，避免深层代理）
const chart = shallowRef<any>(null)
let ro: ResizeObserver | null = null
let echartsLib: any = null
let mounted = true

/** echarts 动态加载（按需，可选 peerDep） */
async function loadEcharts() {
  if (echartsLib) return echartsLib
  echartsLib = await import('echarts')
  return echartsLib
}

/** 容器是否有非零真实尺寸 */
function hasSize(el: HTMLElement | null): boolean {
  return !!el && el.clientWidth > 0 && el.clientHeight > 0
}

/**
 * 等待容器获得非零尺寸。
 * onMounted 时容器可能尚未完成布局（尤其在 flex/grid 嵌套、隐藏 tab、
 * 动态展开等场景），此时 init 会触发
 * "Can't get DOM width or height" 警告。用 ResizeObserver + 兜底轮询等待。
 */
function waitForSize(el: HTMLElement, timeout = 2000): Promise<void> {
  return new Promise((resolve) => {
    if (hasSize(el)) return resolve()
    const start = Date.now()
    const tick = () => {
      if (!mounted) return resolve()
      if (hasSize(el)) return resolve()
      if (Date.now() - start >= timeout) return resolve() // 超时也放行，让 echarts 用 fallback
      requestAnimationFrame(tick)
    }
    tick()
  })
}

/** 安全 resize：容器为 0 时跳过，避免无效警告 */
function safeResize() {
  if (chart.value && hasSize(chartRef.value)) {
    chart.value.resize()
  }
}

onMounted(async () => {
  if (!chartRef.value) return

  // 1. 加载 echarts（可能未安装）—— 单独捕获，提示安装
  let echarts: any
  try {
    echarts = await loadEcharts()
  } catch (e) {
    console.error(
      '[FzmUI/BaseChart] 需要安装 echarts 才能使用本组件：`pnpm add echarts`',
      e,
    )
    return
  }
  if (!mounted || !chartRef.value) return

  // 2. 等待容器获得真实尺寸，再初始化
  await waitForSize(chartRef.value)
  if (!mounted || !chartRef.value) return

  chart.value = echarts.init(chartRef.value, null, { renderer: 'canvas' })

  // 3. ResizeObserver：容器尺寸变化时自适应；初始回调为 0 时跳过
  ro = new ResizeObserver(() => safeResize())
  ro.observe(chartRef.value)

  // 4. window resize（如非 ResizeObserver 触发的窗口缩放）
  window.addEventListener('resize', safeResize)

  // 5. 设置 option —— 单独捕获，option 错误不应被误报为“未安装 echarts”
  try {
    chart.value.setOption(props.option)
  } catch (e) {
    console.error(
      '[FzmUI/BaseChart] setOption 失败，请检查 option 配置（常见原因：颜色值不是合法颜色，canvas 无法解析 CSS 变量，应使用 useChartPalette 返回的实际颜色值）',
      e,
    )
  }

  await nextTick()
  safeResize()
})

watch(
  () => props.option,
  (o) => {
    if (chart.value) chart.value.setOption(o, props.notMerge)
  },
  { deep: true },
)

onBeforeUnmount(() => {
  mounted = false
  window.removeEventListener('resize', safeResize)
  ro?.disconnect()
  ro = null
  chart.value?.dispose()
  chart.value = null
})
</script>

<template>
  <div ref="chartRef" class="fzm-chart" :style="{ width, height }" />
</template>

<style scoped>
.fzm-chart {
  width: 100%;
  height: 100%;
}

/* 图表填充容器：需要 100% 填满父卡片时，外层包 .fzm-chart-fill */
:global(.fzm-chart-fill) {
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
  position: relative;
  overflow: hidden;
}

:global(.fzm-chart-fill > *) {
  width: 100% !important;
  height: 100% !important;
}
</style>
