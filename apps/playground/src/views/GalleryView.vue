<script setup lang="ts">
/**
 * GalleryView — 组件分类总览
 * 按 5 类展示全部 30 个组件，每个卡片显示组件名 + 一句话描述。
 * 点击任一卡片 → 跳转到组件演示页对应锚点（高亮闪烁定位）。
 */
import { inject } from 'vue'

const navigateToComponent = inject<(anchor: string) => void>('navigateToComponent')!

interface CompMeta {
  /** 组件演示页锚点 id（comp-xxx） */
  anchor: string
  /** 组件名 */
  name: string
  /** 一句话描述 */
  desc: string
}

interface CompGroup {
  /** 分类名 */
  title: string
  /** 分类图标（svg path） */
  icon: string
  /** 该分类下的组件 */
  items: CompMeta[]
}

const groups: CompGroup[] = [
  {
    title: '基础容器',
    icon: 'M3 5l3-2h12l3 2v14l-3 2H6l-3-2z',
    items: [
      { anchor: 'tech-card', name: 'TechCard', desc: '切角科技面板（最常用容器）' },
      { anchor: 'glass-panel', name: 'GlassPanel', desc: '切角玻璃浮层（场景叠加）' },
      { anchor: 'glass-panel', name: 'FzGlass', desc: '统一玻璃浮窗（含 Title/Row/Close 子组件）' },
      { anchor: 'glass-panel', name: 'FzGlass 子组件', desc: 'FzGlassTitle 标题条 / FzGlassRow 数据行 / FzGlassClose 关闭' },
    ],
  },
  {
    title: '数据展示',
    icon: 'M4 4h16v4H4zM4 11h16v4H4zM4 18h10v2H4z',
    items: [
      { anchor: 'kpi-item', name: 'KpiItem', desc: 'KPI 大数字' },
      { anchor: 'count-up', name: 'CountUp', desc: '数字滚动动画' },
      { anchor: 'metric-box', name: 'MetricBox', desc: 'Mini 统计小方块' },
      { anchor: 'data-row', name: 'DataRow', desc: '数据键值行' },
      { anchor: 'data-row', name: 'TechRow', desc: '科技列表项' },
      { anchor: 'tech-tag', name: 'TechTag', desc: '科技标签（可关闭）' },
      { anchor: 'count-up', name: 'TechAvatar', desc: '头像 / 设备图标' },
      { anchor: 'tech-tag', name: 'TechDivider', desc: '分割线（带文字）' },
      { anchor: 'base-chart', name: 'BaseChart', desc: 'ECharts 自适应封装' },
    ],
  },
  {
    title: '反馈与标识',
    icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 7v6M12 16v.5',
    items: [
      { anchor: 'status-dot', name: 'StatusDot', desc: '状态点（脉冲/闪烁）' },
      { anchor: 'count-badge', name: 'CountBadge', desc: '计数徽章' },
      { anchor: 'count-badge', name: 'LevelBadge', desc: '告警等级徽章' },
      { anchor: 'progress-bar', name: 'ProgressBar', desc: '切角流光进度条' },
      { anchor: 'hud-button', name: 'HudButton', desc: 'HUD 操作按钮' },
      { anchor: 'hud-button', name: 'HudChip', desc: 'HUD 提示标签' },
      { anchor: 'tech-tag', name: 'TechEmpty', desc: '空状态占位' },
      { anchor: 'tech-tag', name: 'LoadingSpinner', desc: '加载中（双环旋转）' },
    ],
  },
  {
    title: '输入与导航',
    icon: 'M4 6h16M4 12h16M4 18h16',
    items: [
      { anchor: 'tech-input', name: 'TechInput', desc: '科技风输入框' },
      { anchor: 'tech-input', name: 'TechSelect', desc: '切角下拉选择' },
      { anchor: 'tech-input', name: 'TechSwitch', desc: '开关' },
      { anchor: 'tech-input', name: 'IconToggle', desc: '图标按钮组' },
      { anchor: 'tech-tabs', name: 'TechTabs', desc: '标签页' },
      { anchor: 'tech-tabs', name: 'Segmented', desc: '分段控制器' },
    ],
  },
  {
    title: '布局',
    icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    items: [
      { anchor: 'glass-panel', name: 'AppHeader', desc: '应用级机甲风头部浮条' },
      { anchor: 'glass-panel', name: 'HudFrame', desc: '全屏 HUD 机甲边框' },
      { anchor: 'glass-panel', name: 'Sidebar', desc: '透明浮层侧栏' },
    ],
  },
]
</script>

<template>
  <div class="gallery">
    <!-- 顶部说明 -->
    <div class="gallery__intro">
      <h2 class="gallery__title">组件总览</h2>
      <p class="gallery__subtitle">共 30 个组件，按 5 类组织。点击任一组件卡片可跳转到演示页查看用法。</p>
    </div>

    <!-- 分类墙 -->
    <section v-for="g in groups" :key="g.title" class="gallery__group">
      <header class="gallery__group-header">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="`<path d='${g.icon}'/>`" />
        <span class="gallery__group-title">{{ g.title }}</span>
        <span class="gallery__group-count">{{ g.items.length }}</span>
      </header>

      <div class="gallery__grid">
        <button
          v-for="item in g.items"
          :key="item.name"
          type="button"
          class="gallery__card"
          @click="navigateToComponent(item.anchor)"
        >
          <span class="gallery__card-name">{{ item.name }}</span>
          <span class="gallery__card-desc">{{ item.desc }}</span>
          <span class="gallery__card-arrow">
            查看演示
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.gallery {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 24px;
}

.gallery__intro {
  padding: 6px 2px 0;
}

.gallery__title {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--text-primary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8), 0 0 12px rgb(var(--primary-rgb) / 0.55);
}

.gallery__subtitle {
  margin: 0;
  font-size: 11px;
  color: var(--text-secondary);
}

/* —— 分类 —— */
.gallery__group-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;
  color: var(--primary-lighter);
}

.gallery__group-title {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-shadow: 0 0 10px rgb(var(--primary-rgb) / 0.5);
}

.gallery__group-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 16px;
  padding: 0 5px;
  font-size: 10px;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--primary-lighter);
  background: rgb(var(--primary-rgb) / 0.18);
  border: 1px solid rgb(var(--primary-rgb) / 0.4);
  border-radius: 8px;
}

/* —— 卡片墙 —— */
.gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}

.gallery__card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  text-align: left;
  color: var(--text-secondary);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  /* 左上+右下切角 */
  clip-path: polygon(
    var(--notch) 0,
    100% 0,
    100% calc(100% - var(--notch)),
    calc(100% - var(--notch)) 100%,
    0 100%,
    0 var(--notch)
  );
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
  position: relative;
}

.gallery__card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

.gallery__card:hover .gallery__card-arrow {
  opacity: 1;
  transform: translateX(0);
}

.gallery__card-name {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-shadow: 0 0 10px rgb(var(--primary-rgb) / 0.4);
}

.gallery__card-desc {
  font-size: 10.5px;
  line-height: 1.5;
  color: var(--text-muted);
  opacity: 0.8;
  flex: 1;
}

.gallery__card-arrow {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-top: 6px;
  font-size: 10px;
  font-weight: 600;
  color: var(--primary-lighter);
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s ease;
}
</style>
