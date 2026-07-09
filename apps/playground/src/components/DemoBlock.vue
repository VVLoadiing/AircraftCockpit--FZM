<script setup lang="ts">
/**
 * DemoBlock — 示例展示块
 *
 * 上方渲染示例组件的真实效果（通过默认插槽传入），
 * 下方默认展开源码（语法高亮 + 一键复制），方便直接取用。
 * 与 @fzm-tech-hud/ui 设计风格统一：切角、深色、主题色高亮。
 */
import { ref, computed } from 'vue'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'

hljs.registerLanguage('vue', xml)

const props = defineProps<{
  /** 示例标题 */
  title?: string
  /** 示例源码字符串（?raw 导入） */
  source: string
}>()

/** 是否展开源码（默认展开，方便直接复制使用） */
const showCode = ref(true)
/** 是否已复制 */
const copied = ref(false)

/** 语法高亮后的 HTML（vue/xml） */
const highlighted = computed(() => {
  try {
    return hljs.highlight(props.source, { language: 'vue' }).value
  } catch {
    return props.source
  }
})

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.source)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    /* 剪贴板不可用时静默 */
  }
}
</script>

<template>
  <section class="demo">
    <header v-if="title" class="demo__title">{{ title }}</header>

    <!-- 实时预览区（仅当传入插槽内容时渲染；纯代码示例不显示预览） -->
    <div v-if="$slots.default" class="demo__preview">
      <slot />
    </div>

    <!-- 代码区：操作条 + 源码 -->
    <div class="demo__code">
      <div class="demo__toolbar">
        <span class="demo__code-label">代码</span>
        <span class="demo__toolbar-spacer" />
        <button type="button" class="demo__btn demo__btn--ghost" @click="copyCode">
          {{ copied ? '已复制 ✓' : '复制代码' }}
        </button>
        <button type="button" class="demo__btn" @click="showCode = !showCode">
          {{ showCode ? '收起' : '展开' }}
        </button>
      </div>
      <pre v-show="showCode" class="demo__pre"><code class="hljs language-vue" v-html="highlighted" /></pre>
    </div>
  </section>
</template>

<style scoped>
.demo {
  margin-bottom: 28px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.demo__title {
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--text-primary);
  background: linear-gradient(
    90deg,
    rgb(var(--accent-rgb) / 0.22) 0%,
    rgb(var(--accent-rgb) / 0.06) 60%,
    transparent 100%
  );
  border-bottom: 1px solid var(--border-color);
  text-shadow: 0 0 10px rgb(var(--primary-rgb) / 0.4);
}

.demo__preview {
  /* min-height 防止小案例/图表在预览区塌缩；保持 block 让示例自带的 flex/grid 布局正常生效 */
  min-height: 100px;
  padding: 28px 20px;
  /* 预览区给一个略微下沉的底，与代码区区分 */
  background:
    linear-gradient(rgba(255, 255, 255, 0.015), rgba(255, 255, 255, 0.015)),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 12px,
      rgba(255, 255, 255, 0.012) 12px,
      rgba(255, 255, 255, 0.012) 24px
    );
}

.demo__code {
  border-top: 1px solid var(--border-color);
}

.demo__toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: rgb(var(--primary-rgb) / 0.05);
}

.demo__code-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-muted);
  opacity: 0.7;
}

.demo__toolbar-spacer {
  flex: 1;
}

.demo__btn {
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--primary-lighter);
  background: rgb(var(--primary-rgb) / 0.12);
  border: 1px solid rgb(var(--primary-rgb) / 0.35);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: inherit;
}

.demo__btn:hover {
  color: var(--accent-light);
  background: rgb(var(--primary-rgb) / 0.22);
  border-color: var(--accent);
}

.demo__btn--ghost {
  color: var(--text-secondary);
  background: transparent;
  border-color: var(--border-color);
}

.demo__btn--ghost:hover {
  color: var(--accent-light);
  border-color: var(--accent);
}

.demo__pre {
  margin: 0;
  padding: 14px 16px;
  max-height: 460px;
  overflow: auto;
  font-family: var(--font-mono, 'SFMono-Regular', Consolas, monospace);
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--text-secondary);
  background: rgb(0 0 0 / 0.25);
  scrollbar-width: thin;
}

/* highlight.js 浅色 token 覆写为深色科技风配色 */
.demo__pre :deep(.hljs-tag) {
  color: #7dd3fc;
}
.demo__pre :deep(.hljs-name) {
  color: #5eead4;
}
.demo__pre :deep(.hljs-attr) {
  color: #fcd34d;
}
.demo__pre :deep(.hljs-string) {
  color: #86efac;
}
.demo__pre :deep(.hljs-comment) {
  color: #64748b;
  font-style: italic;
}
.demo__pre :deep(.hljs-keyword) {
  color: #c4b5fd;
}
.demo__pre :deep(.hljs-number) {
  color: #fda4af;
}
</style>
