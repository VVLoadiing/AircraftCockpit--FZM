<script setup lang="ts">
/**
 * ComponentDocView — 组件文档页
 *
 * 依据路由参数 :name 从 registry 加载组件文档配置，
 * 渲染：标题 / 简介 / 多个示例（DemoBlock：预览 + 源码）/ Props·Slots·Events 表格。
 * 未找到时显示 TechEmpty + 返回总览。
 */
import { ref, shallowRef, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DemoBlock from '../components/DemoBlock.vue'
import { findEntry } from '../docs/registry'
import { HudButton, TechEmpty } from '@fzm-tech-hud/ui'
import type { ComponentDoc } from '../docs/types'

const route = useRoute()
const router = useRouter()

/**
 * doc 用 shallowRef 而非 ref：doc 内 demos[].component 是 Vue 组件对象，
 * ref 会对其做深度响应式代理（触发 "made a reactive object" 警告 + 性能损耗）。
 * shallowRef 只追踪 .value 的替换，组件对象保持原样，符合官方对存组件的推荐。
 */
const doc = shallowRef<ComponentDoc | null>(null)
const loading = ref(false)
const notFound = ref(false)

const componentName = computed(() => String(route.params.name ?? ''))

async function load() {
  const entry = findEntry(componentName.value)
  if (!entry) {
    doc.value = null
    notFound.value = true
    return
  }
  loading.value = true
  notFound.value = false
  try {
    const mod = await entry.loader()
    doc.value = mod.default
  } finally {
    loading.value = false
  }
}

watch(() => route.params.name, load, { immediate: true })
</script>

<template>
  <div class="doc-view">
    <!-- 加载中 -->
    <div v-if="loading" class="doc-view__state">加载中…</div>

    <!-- 未找到 -->
    <TechEmpty v-else-if="notFound" description="未找到该组件的文档">
      <HudButton type="primary" @click="router.push('/intro')">返回组件库说明</HudButton>
    </TechEmpty>

    <!-- 文档正文 -->
    <template v-else-if="doc">
      <header class="doc-view__header">
        <h1 class="doc-view__title">{{ doc.title }}</h1>
        <span class="doc-view__category">{{ doc.category }}</span>
      </header>

      <p class="doc-view__desc">{{ doc.description }}</p>

      <p v-for="(p, i) in doc.intro" :key="i" class="doc-view__intro">{{ p }}</p>

      <!-- 示例 -->
      <h2 class="doc-view__section-title">代码示例</h2>
      <DemoBlock
        v-for="(demo, i) in doc.demos"
        :key="i"
        :title="demo.title"
        :source="demo.source"
      >
        <component :is="demo.component" />
      </DemoBlock>

      <!-- API -->
      <h2 class="doc-view__section-title">API</h2>

      <section v-if="doc.props?.length" class="doc-view__api">
        <h3 class="doc-view__api-title">Props</h3>
        <table class="api-table">
          <thead>
            <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in doc.props" :key="p.name">
              <td><code>{{ p.name }}</code></td>
              <td><code>{{ p.type }}</code></td>
              <td><code>{{ p.default }}</code></td>
              <td>{{ p.desc }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-if="doc.slots?.length" class="doc-view__api">
        <h3 class="doc-view__api-title">Slots</h3>
        <table class="api-table">
          <thead>
            <tr><th>名称</th><th>说明</th></tr>
          </thead>
          <tbody>
            <tr v-for="s in doc.slots" :key="s.name">
              <td><code>{{ s.name }}</code></td>
              <td>{{ s.desc }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-if="doc.events?.length" class="doc-view__api">
        <h3 class="doc-view__api-title">Events</h3>
        <table class="api-table">
          <thead>
            <tr><th>名称</th><th>参数</th><th>说明</th></tr>
          </thead>
          <tbody>
            <tr v-for="e in doc.events" :key="e.name">
              <td><code>{{ e.name }}</code></td>
              <td><code>{{ e.params }}</code></td>
              <td>{{ e.desc }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </div>
</template>

<style scoped>
.doc-view {
  max-width: 1440px;
  margin: 0 auto;
  padding: 8px 0 60px;
}

.doc-view__state {
  padding: 40px 0;
  text-align: center;
  color: var(--text-secondary);
  font-size: 13px;
}

.doc-view__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.doc-view__title {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: var(--text-primary);
  text-shadow: 0 0 16px rgb(var(--primary-rgb) / 0.45);
}

.doc-view__category {
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--primary-lighter);
  background: rgb(var(--primary-rgb) / 0.15);
  border: 1px solid rgb(var(--primary-rgb) / 0.4);
  border-radius: 999px;
}

.doc-view__desc {
  margin: 0 0 10px;
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 600;
}

.doc-view__intro {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.75;
  color: var(--text-secondary);
}

.doc-view__section-title {
  margin: 36px 0 16px;
  padding-bottom: 8px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--text-primary);
  border-bottom: 1px solid rgb(var(--primary-rgb) / 0.25);
}

.doc-view__api {
  margin-bottom: 28px;
}

.doc-view__api-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
  color: var(--accent-light);
  letter-spacing: 0.5px;
}

/* —— API 表格 —— */
.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}

.api-table th {
  padding: 8px 12px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-secondary);
  background: rgb(var(--primary-rgb) / 0.08);
  border-bottom: 1px solid var(--border-color);
}

.api-table td {
  padding: 9px 12px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  vertical-align: top;
  line-height: 1.6;
}

.api-table tr:last-child td {
  border-bottom: none;
}

.api-table code {
  font-family: var(--font-mono, 'SFMono-Regular', Consolas, monospace);
  font-size: 12px;
  color: var(--accent-light);
  background: rgb(var(--primary-rgb) / 0.1);
  padding: 1px 6px;
  border-radius: 4px;
  word-break: break-word;
}
</style>
