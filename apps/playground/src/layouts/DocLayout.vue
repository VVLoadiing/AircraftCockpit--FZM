<script setup lang="ts">
/**
 * DocLayout — 文档布局
 *
 * 与大屏浮层架构（DashboardLayout）完全独立的第二套布局：
 *  - 顶部导航条：返回大屏入口 + 站点标题 + 主题切换
 *  - 左侧固定目录：按分类列出全部组件（来自 registry）
 *  - 右侧内容区：<RouterView /> 渲染 ComponentDocView（可滚动）
 *
 * 不铺 3D 场景；整页用 fixed 容器自管滚动，规避 body{overflow:hidden}。
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  useUiTheme,
  UI_STYLE_OPTIONS,
  TechSelect,
} from '@fzm/ui'
import { categoryGroups } from '../docs/registry'

const route = useRoute()
const router = useRouter()

/** 当前选中的组件名（用于目录高亮） */
const activeName = computed(() => String(route.params.name ?? ''))

const { style: themeStyle, setStyle } = useUiTheme()
const themeSelectOptions = UI_STYLE_OPTIONS.map((o) => ({
  label: o.name,
  value: o.id,
}))
function dotStyle(color: unknown) {
  return color ? { background: String(color) } : undefined
}
const activeColor = computed(() => UI_STYLE_OPTIONS.find((o) => o.id === themeStyle.value)?.color)

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="doc-layout">
    <!-- 顶部导航条 -->
    <header class="doc-layout__topbar">
      <button type="button" class="doc-layout__back" @click="goHome">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        返回大屏
      </button>

      <span class="doc-layout__brand">
        <span class="doc-layout__brand-dot" :style="dotStyle(activeColor)" />
        曜蓝机甲 Tech HUD · 组件文档
      </span>

      <div class="doc-layout__theme">
        <TechSelect
          :model-value="themeStyle"
          :options="themeSelectOptions"
          @change="(v: string | number) => setStyle(v as any)"
        />
      </div>
    </header>

    <div class="doc-layout__body">
      <!-- 左侧目录 -->
      <aside class="doc-layout__sidebar">
        <nav class="doc-nav">
          <section v-for="g in categoryGroups" :key="g.title" class="doc-nav__group">
            <h3 class="doc-nav__group-title">{{ g.title }}</h3>
            <RouterLink
              v-for="item in g.items"
              :key="item.name"
              :to="`/components/${item.name}`"
              class="doc-nav__item"
              :class="{ 'is-active': activeName === item.name }"
            >
              {{ item.title }}
            </RouterLink>
          </section>
        </nav>
      </aside>

      <!-- 右侧内容区（滚动） -->
      <main class="doc-layout__content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.doc-layout {
  position: fixed;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  /* 文档站用深色底（区别于大屏的浅色 3D 场景底），确保白色文字清晰可读 */
  background:
    radial-gradient(circle at 50% 0%, rgba(8, 30, 50, 0.6), transparent 55%),
    var(--bg-body);
}

/* —— 顶部导航条 —— */
.doc-layout__topbar {
  flex: none;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 52px;
  padding: 0 18px;
  background: var(--bg-card-strong);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.doc-layout__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 12px;
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

.doc-layout__back:hover {
  color: var(--accent-light);
  border-color: var(--accent);
  background: rgb(var(--primary-rgb) / 0.1);
}

.doc-layout__brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--text-primary);
  text-shadow: 0 0 10px rgb(var(--primary-rgb) / 0.4);
}

.doc-layout__brand-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 8px currentColor;
}

.doc-layout__theme {
  margin-left: auto;
}

/* —— 主体：侧栏 + 内容 —— */
.doc-layout__body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.doc-layout__sidebar {
  flex: none;
  width: 230px;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgba(3, 12, 22, 0.6);
  border-right: 1px solid var(--border-color);
  scrollbar-width: thin;
}

.doc-nav {
  padding: 16px 10px 40px;
}

.doc-nav__group {
  margin-bottom: 22px;
}

.doc-nav__group-title {
  margin: 0 0 8px;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  text-transform: uppercase;
}

.doc-nav__item {
  display: block;
  padding: 7px 12px;
  font-size: 12.5px;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  border-left: 2px solid transparent;
  transition: all 0.15s ease;
  cursor: pointer;
}

.doc-nav__item:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.doc-nav__item.is-active {
  color: var(--accent-light);
  background: rgb(var(--primary-rgb) / 0.12);
  border-left-color: var(--accent);
  font-weight: 600;
}

/* —— 右侧内容区 —— */
.doc-layout__content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 28px 36px;
  scrollbar-width: thin;
}
</style>
