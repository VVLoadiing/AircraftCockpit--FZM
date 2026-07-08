<script setup lang="ts">
/**
 * EditModeView — 大屏编辑模式
 *
 * 左右双侧栏（复用 Sidebar + TechCard 布局，参照 DashboardView），
 * 用户可在每侧：
 *   - 添加 TechCard（选类型 + 标题）
 *   - 删除 / 上下移动 / 改类型 / 改标题（编辑态）
 *   - 关闭编辑态纯预览
 *   - 恢复默认布局
 * 布局自动持久化到 localStorage（见 useEditLayout）。
 */
import { ref } from 'vue'
import { Sidebar, TechSelect, TechInput, HudButton, TechEmpty } from '@fzm/ui'
import EditableCard from '../components/edit/EditableCard.vue'
import {
  useEditLayout,
  CONTENT_TYPES,
  type Side,
  type ContentType,
  type SelectOption,
} from '../composables/useEditLayout'

const {
  layout,
  addCard,
  removeCard,
  moveCard,
  updateTitle,
  updateContentType,
  updateSize,
  resetLayout,
} = useEditLayout()

/** 编辑态开关（默认开启，进入即编辑） */
const editing = ref(true)

/** 左右双侧栏配置（模板 v-for 用，消除左右栏重复结构） */
const sides: { key: Side; label: string }[] = [
  { key: 'left', label: '左' },
  { key: 'right', label: '右' },
]

/* —— 添加面板状态（每侧独立一份） —— */
interface AddDraft {
  contentType: ContentType
  title: string
}
const drafts = ref<Record<Side, AddDraft>>({
  left: { contentType: 'line', title: '' },
  right: { contentType: 'metric', title: '' },
})
/** 哪一侧的添加面板展开 */
const openPanel = ref<Side | null>(null)

const typeOptions: SelectOption[] = CONTENT_TYPES.map((c) => ({
  label: `[${c.category}] ${c.label}`,
  value: c.type,
}))

function openAdd(side: Side) {
  // 切换展开（点已展开的则收起）
  openPanel.value = openPanel.value === side ? null : side
}

function confirmAdd(side: Side) {
  const d = drafts.value[side]
  addCard(side, d.contentType, d.title)
  // 重置草稿、收起面板
  d.contentType = side === 'left' ? 'line' : 'metric'
  d.title = ''
  openPanel.value = null
}

function onTypeChange(side: Side, val: string | number) {
  drafts.value[side].contentType = val as ContentType
}
</script>

<template>
  <div class="edit-mode">
    <!-- 顶部工具栏（玻璃浮条，居中浮于 header 下方） -->
    <div class="edit-mode__toolbar">
      <span class="edit-mode__title">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        编辑模式
      </span>
      <span class="edit-mode__hint">
        {{ editing ? '编辑态：调整卡片后自动保存' : '预览态：只读查看当前布局' }}
      </span>

      <span class="edit-mode__spacer" />

      <button
        v-if="editing"
        type="button"
        class="edit-mode__tool-btn edit-mode__tool-btn--danger"
        @click="resetLayout"
      >
        恢复默认
      </button>
      <button
        type="button"
        class="edit-mode__tool-btn"
        :class="{ 'is-primary': editing }"
        @click="editing = !editing"
      >
        {{ editing ? '完成编辑' : '进入编辑' }}
      </button>
    </div>

    <!-- 左右双侧栏：结构完全对称，用 v-for 渲染消除重复 -->
    <Sidebar
      v-for="side in sides"
      :key="side.key"
      class="edit-mode__sidebar"
      :class="`edit-mode__sidebar--${side.key}`"
    >
      <EditableCard
        v-for="(card, i) in layout[side.key]"
        :key="card.id"
        :card="card"
        :editing="editing"
        :is-first="i === 0"
        :is-last="i === layout[side.key].length - 1"
        @move="(dir) => moveCard(side.key, card.id, dir)"
        @remove="removeCard(side.key, card.id)"
        @update-content-type="(t) => updateContentType(side.key, card.id, t)"
        @update-title="(t) => updateTitle(side.key, card.id, t)"
        @update-size="(w, h) => updateSize(side.key, card.id, w, h)"
      />

      <!-- 空状态 -->
      <TechEmpty v-if="layout[side.key].length === 0" :description="`${side.label}栏为空，点下方按钮添加卡片`" />

      <!-- 添加区（仅编辑态） -->
      <template v-if="editing">
        <button
          type="button"
          class="edit-mode__add-btn"
          :class="{ 'is-open': openPanel === side.key }"
          @click="openAdd(side.key)"
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {{ openPanel === side.key ? '收起' : '添加 TechCard' }}
        </button>

        <div v-if="openPanel === side.key" class="edit-mode__add-panel">
          <label class="edit-mode__field">
            <span class="edit-mode__field-label">内容类型</span>
            <TechSelect
              :model-value="drafts[side.key].contentType"
              :options="typeOptions"
              @change="(v: string | number) => onTypeChange(side.key, v)"
            />
          </label>
          <label class="edit-mode__field">
            <span class="edit-mode__field-label">标题（可选）</span>
            <TechInput
              v-model="drafts[side.key].title"
              placeholder="留空使用类型名"
            />
          </label>
          <HudButton type="primary" native-type="button" @click="confirmAdd(side.key)">
            确认添加
          </HudButton>
        </div>
      </template>
    </Sidebar>
  </div>
</template>

<style scoped>
/*
 * 布局参照 DashboardView：容器 fixed 占满，左右栏贴边浮层。
 * 编辑模式独有顶部工具栏（浮于二级导航下方）。
 */
.edit-mode {
  position: fixed;
  inset: 0;
  z-index: 10;
  pointer-events: none; /* 容器不拦截场景交互，子元素各自启用 */
}

.edit-mode > * {
  pointer-events: auto;
}

/* —— 顶部工具栏 —— */
.edit-mode__toolbar {
  position: fixed;
  top: calc(10px + var(--header-h) + 50px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 14;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: var(--glass-radius);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: var(--glass-shadow);
  max-width: calc(100% - 2 * var(--sidebar-w) - 40px);
}

.edit-mode__title {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--text-primary);
  text-shadow: 0 0 10px rgb(var(--primary-rgb) / 0.5);
}

.edit-mode__hint {
  font-size: 10.5px;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
}

.edit-mode__spacer {
  flex: 1;
}

.edit-mode__tool-btn {
  padding: 5px 14px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-primary);
  background: var(--bg-hover);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: inherit;
}

.edit-mode__tool-btn:hover {
  border-color: var(--border-strong);
  color: var(--accent-light);
}

.edit-mode__tool-btn.is-primary {
  color: var(--text-on-primary);
  background: var(--primary-gradient);
  border-color: transparent;
  box-shadow: 0 0 10px rgb(var(--primary-rgb) / 0.4);
}

.edit-mode__tool-btn--danger {
  color: var(--danger-light, #fca5a5);
  border-color: rgb(var(--danger-rgb, 239 68 68) / 0.4);
}

.edit-mode__tool-btn--danger:hover {
  background: rgb(var(--danger-rgb, 239 68 68) / 0.15);
  border-color: rgb(var(--danger-rgb, 239 68 68) / 0.7);
}

/* —— 左右侧栏（贴边浮层） —— */
.edit-mode__sidebar--left,
.edit-mode__sidebar--right {
  position: fixed;
  top: calc(10px + var(--header-h) + 50px + 52px); /* 工具栏下方 */
  bottom: 20px;
  z-index: 12;
}

.edit-mode__sidebar--left {
  left: 10px;
}

.edit-mode__sidebar--right {
  right: 10px;
}

/* 侧栏内容超出滚动（穿透到 Sidebar 组件） */
.edit-mode__sidebar--left :deep(.fzm-sidebar),
.edit-mode__sidebar--right :deep(.fzm-sidebar) {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

/* —— 添加按钮（侧栏底部切角风格） —— */
.edit-mode__add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--primary-lighter);
  background: rgb(var(--primary-rgb) / 0.08);
  border: 1px dashed rgb(var(--primary-rgb) / 0.5);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: inherit;
}

.edit-mode__add-btn:hover {
  color: var(--accent-light);
  background: rgb(var(--primary-rgb) / 0.18);
  border-color: var(--accent);
  box-shadow: 0 0 12px rgb(var(--primary-rgb) / 0.25);
}

.edit-mode__add-btn.is-open {
  color: var(--accent-light);
  background: rgb(var(--primary-rgb) / 0.18);
  border-style: solid;
  border-color: var(--accent);
}

/* —— 添加面板 —— */
.edit-mode__add-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}

.edit-mode__field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.edit-mode__field-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-secondary);
}

.edit-mode__add-panel :deep(.fzm-hud-btn) {
  align-self: stretch;
}
</style>
