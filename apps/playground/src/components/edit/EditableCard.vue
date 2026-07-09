<script setup lang="ts">
/**
 * EditableCard — 可编辑的 TechCard 包装
 *
 * 用 TechCard 的 #title 插槽接管标题栏：
 *   [标题文字]                    [↑] [↓] [类型] [✕]
 * - 标题双击进入可编辑态，blur 保存
 * - ↑↓ 调整顺序（首位禁用 ↑、末位禁用 ↓）
 * - 类型下拉即时切换内部内容
 * - ✕ 删除卡片
 *
 * 编辑态关闭（editing=false）时，全部控件隐藏，标题变为纯展示。
 */
import { ref, computed } from 'vue'
import { TechCard } from '@fzm-tech-hud/ui'
import CardRenderer from './CardRenderer.vue'
import CardSettingsPanel from './CardSettingsPanel.vue'
import {
  type EditableCard as CardData,
  type ContentType,
} from '../../composables/useEditLayout'

const props = defineProps<{
  card: CardData
  editing: boolean
  isFirst: boolean
  isLast: boolean
}>()

const emit = defineEmits<{
  (e: 'move', dir: -1 | 1): void
  (e: 'remove'): void
  (e: 'update-content-type', type: ContentType): void
  (e: 'update-title', title: string): void
  (e: 'update-size', width: string | undefined, height: string | undefined): void
}>()

/** 标题内联编辑 */
const titleEditing = ref(false)
const titleEl = ref<HTMLElement | null>(null)

function startEditTitle() {
  titleEditing.value = true
  // 下一帧聚焦 + 全选 contenteditable 文本
  requestAnimationFrame(() => {
    const el = titleEl.value
    if (!el) return
    el.focus()
    const range = document.createRange()
    range.selectNodeContents(el)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  })
}

function commitTitle() {
  if (!titleEditing.value) return
  const el = titleEl.value
  const val = (el?.textContent ?? '').trim()
  // 空标题回退原标题，避免视觉塌陷
  emit('update-title', val || props.card.title)
  titleEditing.value = false
}

function cancelTitle() {
  if (!titleEditing.value) return
  // 回退 DOM 显示为原标题
  if (titleEl.value) titleEl.value.textContent = props.card.title
  titleEditing.value = false
}

/* —— 设置弹窗 —— */
const showSettings = ref(false)

/* —— 尺寸样式：作用在包裹层 .editable-card（真正的 flex item） —— */
/* 默认未设置宽高 → fill 均分：由 .editable-card 的 CSS 类提供 flex:1 + display:flex，
   把侧栏均分到的高度再传给内部 TechCard，打通整条 flex 链。 */
const cardStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.card.width) s.width = props.card.width
  if (props.card.height) {
    s.height = props.card.height
    // 固定高度时退出侧栏均分（flex:1），改为按指定高度展示
    s.flex = '0 0 auto'
  }
  return s
})

</script>

<template>
  <div class="editable-card" :class="{ 'is-editing': editing }" :style="cardStyle">
    <TechCard
      fill
      :hoverable="!editing"
    >
      <!-- 接管标题栏：左侧标题 + 右侧控件 -->
      <template #title>
        <!-- 标题文字（编辑态可双击改名） -->
        <span
          v-if="!titleEditing"
          class="editable-card__title-text"
          :class="{ 'is-editable': editing }"
          :title="editing ? '双击修改标题' : undefined"
          @dblclick="editing ? startEditTitle() : undefined"
        >
          {{ card.title }}
        </span>
        <span
          v-else
          ref="titleEl"
          class="editable-card__title-input"
          contenteditable="true"
          spellcheck="false"
          @blur="commitTitle"
          @keydown.enter.prevent="commitTitle"
          @keydown.esc.prevent="cancelTitle"
          v-text="card.title"
        />

        <!-- 编辑控件（标题栏右侧：仅保留紧凑图标按钮，类型选择移入设置弹窗） -->
        <span v-if="editing" class="editable-card__controls" @click.stop @mousedown.stop>
          <button
            type="button"
            class="editable-card__btn editable-card__btn--move"
            :disabled="isFirst"
            title="上移"
            @click="emit('move', -1)"
          >
            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
          <button
            type="button"
            class="editable-card__btn editable-card__btn--move"
            :disabled="isLast"
            title="下移"
            @click="emit('move', 1)"
          >
            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <!-- ⚙ 设置按钮：打开宽高 / 标题 / 类型综合设置弹窗 -->
          <button
            type="button"
            class="editable-card__btn editable-card__btn--settings"
            :class="{ 'is-active': showSettings }"
            title="设置（标题 / 类型 / 宽高）"
            @click="showSettings = true"
          >
            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          <button
            type="button"
            class="editable-card__btn editable-card__btn--del"
            title="删除卡片"
            @click="emit('remove')"
          >
            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </span>
      </template>

      <!-- 默认内容区：按 contentType 渲染 -->
      <CardRenderer :content-type="card.contentType" />
    </TechCard>

    <!-- 设置弹窗（编辑态 + 打开时） -->
    <CardSettingsPanel
      v-if="editing && showSettings"
      :card="card"
      @close="showSettings = false"
      @update-title="(t) => emit('update-title', t)"
      @update-content-type="(t) => emit('update-content-type', t)"
      @update-size="(w, h) => emit('update-size', w, h)"
    />
  </div>
</template>

<style scoped>
.editable-card {
  /* 打通 flex 高度链：作为 Sidebar 的 flex item 均分高度（fill 默认），
     同时作为 flex 容器把高度传给内部 TechCard。
     —— 这是 fill 均分生效的关键，缺 display:flex 则 TechCard 的 flex:1 无父级可撑。 */
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-height: 0;
  transition: outline 0.15s ease;
}

/* 编辑态：虚线描边提示可操作 */
.editable-card.is-editing {
  outline: 1px dashed rgb(var(--primary-rgb) / 0.4);
  outline-offset: 2px;
  border-radius: var(--radius-md);
}

/* TechCard 填满包裹层（高度由 .editable-card 的 flex 决定） */
.editable-card :deep(.fzm-card) {
  width: 100%;
  height: 100%;
}

/* —— 标题文字 —— */
.editable-card__title-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.editable-card__title-text.is-editable {
  cursor: text;
}

.editable-card__title-text.is-editable:hover {
  color: var(--accent-light);
}

.editable-card__title-input {
  flex: 1;
  min-width: 0;
  outline: none;
  background: rgb(0 0 0 / 0.25);
  border-bottom: 1px solid var(--accent);
  padding: 0 4px;
  border-radius: 2px;
}

/* —— 标题栏右侧控件 —— */
.editable-card__controls {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-left: auto;
  flex-shrink: 0;
}

.editable-card__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  color: var(--primary-lighter);
  background: rgb(var(--primary-rgb) / 0.14);
  border: 1px solid rgb(var(--primary-rgb) / 0.35);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.editable-card__btn:hover:not(:disabled) {
  color: var(--accent-light);
  background: rgb(var(--primary-rgb) / 0.3);
  border-color: rgb(var(--primary-rgb) / 0.7);
}

.editable-card__btn:active:not(:disabled) {
  transform: scale(0.92);
}

.editable-card__btn:disabled {
  opacity: 0.28;
  cursor: not-allowed;
}

.editable-card__btn--del {
  color: var(--danger-light, #fca5a5);
  background: rgb(var(--danger-rgb, 239 68 68) / 0.12);
  border-color: rgb(var(--danger-rgb, 239 68 68) / 0.4);
}

.editable-card__btn--del:hover:not(:disabled) {
  background: rgb(var(--danger-rgb, 239 68 68) / 0.3);
  border-color: rgb(var(--danger-rgb, 239 68 68) / 0.7);
}

/* ⚙ 设置按钮（齿轮） */
.editable-card__btn--settings.is-active {
  color: var(--accent-light);
  background: rgb(var(--primary-rgb) / 0.3);
  border-color: var(--accent);
}
</style>
