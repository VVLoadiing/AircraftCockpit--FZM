<script setup lang="ts">
/**
 * TechCard — 切角科技面板（最核心容器）
 * 来源：UI设计系统规范.md 第 7.1 / 7.2 节
 *
 * 视觉特征：八边形切角 + 顶部扫光线 + 左切角斜边高亮 + 左侧纵向光柱。
 * 可选 title：以科技横幅条样式渲染（左箭标 + 渐变衬底 + 斜切尾翼）。
 *
 * 注意（Tailwind v4 用户）：不要在本组件根上额外加 display，
 * 否则会盖过外层的 grid/flex utility。需要列向 flex 时请在外层包裹。
 */
withDefaults(
  defineProps<{
    /** 标题（科技横幅条）。不传则不渲染标题条 */
    title?: string
    /** 是否可悬停辉光 */
    hoverable?: boolean
    /** 是否在 flex 列里均分高度（flex: 1 1 0） */
    fill?: boolean
    /** 内容区最小高度（如 '120px'）。内容不足时撑开到该高度 */
    minHeight?: string
    /** 内容区最大高度（如 '300px'）。超出则纵向滚动；'none' 表示不限 */
    maxHeight?: string
  }>(),
  {
    title: '',
    hoverable: true,
    fill: false,
    minHeight: '',
    maxHeight: '',
  },
)
</script>

<template>
  <section class="fzm-card" :class="{ 'is-hoverable': hoverable, 'card-fill': fill }">
    <!-- 7.2 科技横幅条标题 -->
    <header v-if="title || $slots.title" class="fzm-card__title">
      <slot name="title">{{ title }}</slot>
    </header>

    <!-- 默认内容区（卡片内 flex 撑满区，对应文档 .card-fill / .card-body） -->
    <!-- 限制 minHeight/maxHeight 时，内容超出会纵向滚动 -->
    <div
      class="fzm-card__body"
      :class="{ 'is-scrollable': minHeight || maxHeight }"
      :style="{ minHeight: minHeight || undefined, maxHeight: maxHeight || undefined }"
    >
      <slot />
    </div>

    <!-- 底部插槽（如操作区） -->
    <div v-if="$slots.footer" class="fzm-card__footer">
      <slot name="footer" />
    </div>
  </section>
</template>

<style scoped>
.fzm-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  /* 八边形切角（左上 + 右下各切一刀） */
  clip-path: polygon(
    var(--notch) 0,
    100% 0,
    100% calc(100% - var(--notch)),
    calc(100% - var(--notch)) 100%,
    0 100%,
    0 var(--notch)
  );
  transition:
    box-shadow 0.25s ease,
    border-color 0.25s ease;
  min-height: 0;
}

/* 在 flex 列里均分高度 */
.card-fill {
  flex: 1 1 0;
  min-height: 0;
}

/* 左上切角斜边高亮线 + 顶部扫光横线 */
.fzm-card::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(
        135deg,
        rgb(var(--primary-rgb) / 0.85) 0,
        rgb(var(--primary-rgb) / 0.85) 2px,
        transparent 2px
      )
      top left / var(--notch) var(--notch) no-repeat,
    linear-gradient(90deg, transparent, rgb(var(--primary-rgb) / 0.55), transparent)
      top center / 60% 1px no-repeat;
}

/* 左侧纵向发光光柱（机甲细节） */
.fzm-card::after {
  content: '';
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 0;
  width: 2px;
  background: linear-gradient(
    180deg,
    rgb(var(--primary-rgb) / 0.65),
    rgb(var(--primary-rgb) / 0.06) 40%,
    rgb(var(--primary-rgb) / 0.06) 60%,
    rgb(var(--primary-rgb) / 0.45)
  );
  pointer-events: none;
}

.fzm-card.is-hoverable:hover {
  box-shadow: var(--shadow-card-hover);
  border-color: var(--border-strong);
}

/* —— 内容区 —— */
.fzm-card__body {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: calc(100% - 32px);
}

/* 限制高度时纵向滚动（标题/底栏固定，仅内容区滚动） */
.fzm-card__body.is-scrollable {
  overflow-y: auto;
  /* 滚动条沿用全局深色科技风样式 */
  scrollbar-width: thin;
}

.fzm-card__footer {
  margin-top: 10px;
}

/* —— 7.2 科技横幅条标题 —— */
.fzm-card__title {
  position: relative;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  margin: -4px -6px 10px;
  padding: 6px 10px 6px 22px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 2px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8), 0 0 12px rgb(var(--primary-rgb) / 0.55);
  background: linear-gradient(
    90deg,
    rgb(var(--accent-rgb) / 0.3) 0%,
    rgb(var(--accent-rgb) / 0.1) 45%,
    transparent 85%
  );
  clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
  border-bottom: 1px solid rgb(var(--primary-rgb) / 0.35);
}

/* 左侧发光三角箭标 */
.fzm-card__title::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid var(--accent);
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  filter: drop-shadow(0 0 6px rgb(var(--accent-rgb) / 0.9));
}

/* 最左侧 3px 主题色光柱 */
.fzm-card__title::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, var(--primary), var(--primary-dark));
  box-shadow: 0 0 10px rgb(var(--primary-rgb) / 0.9);
}
</style>
