<script setup lang="ts">
import { ref, computed } from 'vue'
import { initUiStyle, HudFrame, TechCard } from '@fzm/ui'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import ComponentsView from './views/ComponentsView.vue'
import DashboardView from './views/DashboardView.vue'

// App 启动即恢复已存主题
initUiStyle()

const tabs = [
  { id: 'dashboard', label: '大屏组装示例', desc: '组件拼装成完整项目' },
  { id: 'components', label: '组件浏览', desc: '逐个查看组件外观与用法' },
] as const

const activeTab = ref<(typeof tabs)[number]['id']>('dashboard')

const currentView = computed(() =>
  activeTab.value === 'dashboard' ? DashboardView : ComponentsView,
)

// 引用 TechCard 以便类型可用（避免未使用告警）
void TechCard
</script>

<template>
  <HudFrame />
  <div class="app">
    <!-- 顶部浮动毛玻璃浮条 -->
    <header class="app__header">
      <div class="app__brand">
        <span class="app__logo" />
        <div class="app__brand-text">
          <strong>曜蓝机甲 Tech HUD</strong>
          <small>大屏数字孪生 / 工业监控 · Playground</small>
        </div>
      </div>

      <nav class="app__tabs">
        <button
          v-for="t in tabs"
          :key="t.id"
          class="app__tab"
          :class="{ 'is-active': activeTab === t.id }"
          @click="activeTab = t.id"
        >
          {{ t.label }}
        </button>
      </nav>

      <ThemeSwitcher />
    </header>

    <main class="app__main">
      <component :is="currentView" />
    </main>
  </div>
</template>

<style scoped>
.app {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 14px;
  gap: 14px;
}

/* —— 顶部浮条 —— */
.app__header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 12px 20px;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: var(--glass-radius);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: var(--glass-shadow);
}

.app__brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.app__logo {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--primary-gradient);
  box-shadow: var(--shadow-glow-blue);
  flex-shrink: 0;
}

.app__brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.app__brand-text strong {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--text-primary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8), 0 0 12px rgb(var(--primary-rgb) / 0.55);
}

.app__brand-text small {
  font-size: 10px;
  color: var(--text-secondary);
}

/* —— 标签 —— */
.app__tabs {
  display: flex;
  gap: 6px;
  margin-left: auto;
}

.app__tab {
  padding: 6px 14px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: inherit;
}

.app__tab:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.app__tab.is-active {
  color: var(--text-primary);
  background: rgb(var(--primary-rgb) / 0.2);
  border-color: rgb(var(--primary-rgb) / 0.5);
  box-shadow: inset 0 0 12px rgb(var(--primary-rgb) / 0.15);
}

/* —— 主体 —— */
.app__main {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
</style>
