<script setup lang="ts">
/**
 * DashboardLayout — 大屏浮层架构布局
 *
 * 保留原有「3D 场景铺底 + AppHeader + subnav 浮条」的大屏体验：
 *  - dashboard / edit 为大屏视图（body 不滚动，浮层叠加在 3D 场景之上）
 *  - 「组件文档」tab 跳转到独立路由 /components（文档布局，正常滚动）
 *
 * 大屏视图通过 <RouterView /> 渲染（子路由配置在 router.ts），
 * 多条路由复用同一布局，3D 场景与 AppHeader 不重建。
 * 组件跳转 navigateToComponent 以 provide 形式暴露给 DashboardView / JumpLink，
 * 内部改为跳转 /components/:name。
 */
import { computed, provide, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { initUiStyle, HudFrame, AppHeader } from '@fzm-tech-hud/ui'

// App 启动即恢复已存主题
initUiStyle()

const router = useRouter()
const route = useRoute()

type TabId = 'dashboard' | 'edit'

const tabs = [
  { id: 'dashboard' as TabId, to: '/', label: '大屏组装示例', desc: '组件拼装成完整项目，点击区域跳转组件' },
  { id: 'edit' as TabId, to: '/edit', label: '编辑模式', desc: '自由增删 TechCard 模块、选择内容样式' },
]

/** 当前激活的大屏 tab（依据路由匹配） */
const activeTab = computed<TabId | ''>(() => {
  if (route.path === '/') return 'dashboard'
  if (route.path === '/edit') return 'edit'
  return ''
})

/** 待跳转的组件锚点（gallery 跳转到 components tab 时的旧锚点兼容，保留 provide 契约） */
const pendingAnchor = ref<string>('')

/**
 * 跳转到指定组件的文档页。
 * DashboardView / JumpLink 通过 inject('navigateToComponent') 调用。
 * @param name 组件 kebab-case 名，如 'tech-card' / 'kpi-item'
 */
function navigateToComponent(name: string) {
  router.push(`/components/${name}`)
}

provide('navigateToComponent', navigateToComponent)
provide('activeTab', activeTab)
provide('pendingAnchor', pendingAnchor)
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
      @click="router.push(t.to)"
    >
      {{ t.label }}
    </button>
    <button
      class="app__tab"
      :class="{ 'is-active': route.path.startsWith('/components') || route.path === '/intro' || route.path === '/theme' }"
      title="组件库说明 + 主题系统 + 每个组件的独立文档页"
      @click="router.push('/intro')"
    >
      组件文档
    </button>
  </nav>

  <!-- 主体内容区（透明浮层，RouterView 渲染当前大屏视图） -->
  <main class="app__main">
    <RouterView />
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
