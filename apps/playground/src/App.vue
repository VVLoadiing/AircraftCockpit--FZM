<script setup lang="ts">
import { ref, computed, provide, nextTick } from 'vue'
import { initUiStyle, HudFrame, AppHeader } from '@fzm/ui'
import GalleryView from './views/GalleryView.vue'
import ComponentsView from './views/ComponentsView.vue'
import DashboardView from './views/DashboardView.vue'
import EditModeView from './views/EditModeView.vue'

// App 启动即恢复已存主题
initUiStyle()

type TabId = 'dashboard' | 'edit' | 'gallery' | 'components'

const tabs = [
  { id: 'dashboard' as TabId, label: '大屏组装示例', desc: '组件拼装成完整项目，点击区域跳转组件' },
  { id: 'edit' as TabId, label: '编辑模式', desc: '自由增删 TechCard 模块、选择内容样式' },
  { id: 'gallery' as TabId, label: '组件总览', desc: '按分类查看全部 30 个组件' },
  { id: 'components' as TabId, label: '组件演示', desc: '逐个查看组件外观与用法' },
]

const activeTab = ref<TabId>('dashboard')
// 待跳转的组件锚点（navigateToComponent 设置，ComponentsView 消费后清空）
const pendingAnchor = ref<string>('')

const currentView = computed(() => {
  if (activeTab.value === 'dashboard') return DashboardView
  if (activeTab.value === 'edit') return EditModeView
  if (activeTab.value === 'gallery') return GalleryView
  return ComponentsView
})

/**
 * 跳转到指定组件的演示锚点。
 * 切换到 components tab，设置锚点，ComponentsView watch 到后滚动定位。
 * @param anchor 组件 kebab-case 名，如 'tech-card' / 'kpi-item'
 */
function navigateToComponent(anchor: string) {
  pendingAnchor.value = anchor
  if (activeTab.value !== 'components') {
    activeTab.value = 'components'
  }
  // 已在 components tab 时，watch 不会因同值触发，手动滚一次
  nextTick(() => {
    if (activeTab.value === 'components') {
      const el = document.getElementById(`comp-${anchor}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

// 提供给子组件（DashboardView / GalleryView）调用
provide('navigateToComponent', navigateToComponent)
provide('activeTab', activeTab)
</script>

<template>
  <HudFrame />
  <!-- 3D 场景全屏铺底（所有 UI 浮层叠加其上） -->
  <div class="app__scene">
    <div class="app__scene-grid" />
    <div class="app__scene-hint">
      <span>3D 场景占位 · 全屏铺底</span>
      <small>实际项目中此处放数字孪生 / 三维模型，UI 以浮层形式叠加其上</small>
    </div>
  </div>

  <!-- 顶部 AppHeader 浮层 -->
  <AppHeader
    title="曜蓝机甲 Tech HUD"
    subtitle="TECH HUD · DIGITAL TWIN SYSTEM"
    region="数字孪生"
    weather="工业监控"
    :alarm-count="12"
    class="app__header"
  />

  <!-- 二级导航浮条（浮在 header 下方） -->
  <nav class="app__subnav">
    <button
      v-for="t in tabs"
      :key="t.id"
      class="app__tab"
      :class="{ 'is-active': activeTab === t.id }"
      :title="t.desc"
      @click="activeTab = t.id"
    >
      {{ t.label }}
    </button>
  </nav>

  <!-- 主体内容区（透明浮层，承载各视图） -->
  <main class="app__main">
    <component :is="currentView" :pending-anchor="pendingAnchor" />
  </main>
</template>

<style scoped>
/* 3D 场景：全屏铺底，固定定位占满视口 */
.app__scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 45%, rgba(80, 140, 160, 0.14), transparent 62%),
    radial-gradient(circle at 50% 100%, rgba(80, 140, 160, 0.08), transparent 50%),
    var(--bg-scene);
}

.app__scene-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(5, 30, 54, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(5, 30, 54, 0.08) 1px, transparent 1px);
  background-size: 28px 28px;
}

.app__scene-hint {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #2a4a5e;
  pointer-events: none;
}

.app__scene-hint span {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 2px;
}

.app__scene-hint small {
  font-size: 10px;
  opacity: 0.7;
}

/* 顶部 AppHeader 浮层：贴顶居中，左右留出侧栏空间
   !important 确保覆盖 AppHeader 组件内部的 relative 定位 */
.app__header {
  position: fixed !important;
  top: 10px;
  left: 10px;
  right: 10px;
  z-index: 30 !important;
}

/* 二级导航浮条：浮在 header 下方 */
.app__subnav {
  position: fixed;
  top: calc(10px + var(--header-h) + 8px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  display: flex;
  gap: 6px;
  padding: 6px 10px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}

.app__tab {
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: inherit;
}

.app__tab:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.app__tab.is-active {
  color: var(--text-on-primary);
  background: var(--primary-gradient);
  box-shadow: 0 0 10px rgb(var(--primary-rgb) / 0.4);
}

/* 主体内容区：占满视口，透明，内部各视图自行布局浮层 */
.app__main {
  position: fixed;
  inset: 0;
  z-index: 10;
  pointer-events: none; /* 容器本身不拦截场景交互 */
}

/* 子视图需要交互的元素重新启用 pointer-events */
.app__main :deep(*) {
  pointer-events: auto;
}
</style>
