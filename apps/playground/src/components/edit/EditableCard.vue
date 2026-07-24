<script setup lang="ts">
/**
 * EditableCard — 自由画布上的可编辑卡片
 *
 * 纯 absolute 定位（相对 .edit-mode 画布），左键拖动改位置：
 *   [标题文字]                    [⚙] [✕]
 * - 标题双击进入可编辑态，blur 保存
 * - ⚙ 打开设置弹窗（标题 / 类型 / 宽高）
 * - ✕ 删除卡片
 *
 * 编辑态关闭（editing=false）时，控件隐藏、拖动禁用，卡片变为纯展示。
 */
import { ref, computed, watch } from 'vue'
import { TechCard, useDraggable } from '@fzm-tech-hud/ui'
import CardRenderer from './CardRenderer.vue'
import CardSettingsPanel from './CardSettingsPanel.vue'
import {
  type EditableCard as CardData,
  type ContentType,
} from '../../composables/useEditLayout'
import { useSnapAlign, type CardGeom, type AlignLine, type ResizeDir } from '../../composables/useSnapAlign'

const props = defineProps<{
  card: CardData
  editing: boolean
  /** 画布容器（拖动边界，即 .edit-mode）—— 卡片不拖出此区域 */
  canvas?: HTMLElement | null
  /** 静态层级（数组序号），后加的卡片盖在前面的上；拖动时自动提权到顶层 */
  zIndex?: number
  /** 其他卡片的几何信息（用于拖动时对齐吸附） */
  alignOthers?: CardGeom[]
}>()

const emit = defineEmits<{
  (e: 'remove'): void
  (e: 'update-content-type', type: ContentType): void
  (e: 'update-title', title: string): void
  (e: 'update-size', width: string | undefined, height: string | undefined): void
  (e: 'update-position', x: number, y: number): void
  /** 回传当前激活的对齐参考线（驱动 EditModeView 渲染） */
  (e: 'align-lines', lines: AlignLine[]): void
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

/* —— 卡片根元素 ref（useDraggable 绑定目标）—— */
const rootRef = ref<HTMLElement | null>(null)

/* —— 拖动：仅编辑态可拖（左键）；边界为画布容器（.edit-mode），不拖出视口。
   控件区已有 mousedown.stop，点 ⚙/✕ 不会误触发拖动。position 由 useDraggable
   驱动，transform 绑定它；initial 读持久化的 x/y；拖动结束 onEnd 时 emit 落库。
   onMove 里调 snapAlign 做对齐吸附 —— 命中则覆盖 position.value，并回传参考线。 */
const boundsRef = computed(() => props.canvas ?? null)
const { alignLines, snapAlign, clearLines } = useSnapAlign()

/** 当前卡片几何（实时位置 + 持久化尺寸，供 snapAlign 检测） */
function currentGeom(x: number, y: number): CardGeom {
  const w = parseInt(props.card.width || '320', 10)
  const h = parseInt(props.card.height || '200', 10)
  return { x, y, w, h }
}

// 参考线变化时回传给 EditModeView 渲染（拖动中实时、结束清空）
watch(alignLines, (lines) => emit('align-lines', lines))

const { position, isDragging } = useDraggable(rootRef, {
  initial: { x: props.card.x ?? 0, y: props.card.y ?? 0 },
  bounds: boundsRef,
  disabled: computed(() => !props.editing),
  onMove: (raw) => {
    // 拖动中对齐吸附：用原始位置 + 其他卡片几何，算吸附后的位置写回 position
    const others = props.alignOthers ?? []
    if (others.length === 0) {
      clearLines()
      return
    }
    const snapped = snapAlign(currentGeom(raw.x, raw.y), others)
    position.value = { x: snapped.x, y: snapped.y }
  },
  onEnd: (pos) => {
    clearLines()
    emit('update-position', pos.x, pos.y)
  },
})

/* —— 样式：纯 absolute 定位（相对画布），transform 走 GPU ——
   正常态：位置用 useDraggable 的 position，尺寸用 card.width/height
   拉升态：位置/尺寸用本地 resizeW/H/X/Y 覆盖（实时最顺滑）
   z-index：拖动/拉升中提权到顶层，否则用传入的静态层级。 */
const cardStyle = computed((): Record<string, string> => {
  const active = isDragging.value || resizing.value
  const x = resizing.value ? resizeX.value : position.value.x
  const y = resizing.value ? resizeY.value : position.value.y
  const w = resizing.value ? `${resizeW.value}px` : props.card.width || '320px'
  const h = resizing.value ? `${resizeH.value}px` : props.card.height || '200px'
  return {
    position: 'absolute',
    left: '0',
    top: '0',
    transform: `translate3d(${x}px, ${y}px, 0)`,
    width: w,
    height: h,
    zIndex: active ? '100' : String(props.zIndex ?? 1),
  }
})

/* —— 8 向拉升（resize）——
   手柄 mousedown 启动，挂 document mousemove/mouseup；左/上拉伸时同步改 x/y 保持对侧不动。
   与 useDraggable 互斥：手柄 mousedown.stop 阻止冒泡到 rootRef，不触发拖动。 */
const MIN_W = 160
const MIN_H = 120
/** 8 个拉升方向（模板 v-for 用） */
const RESIZE_DIRS: ResizeDir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

/** 拉升中标志（驱动 cardStyle 走本地尺寸） */
const resizing = ref(false)
/** 拉升中实时尺寸/位置（数字，结束时格式化回字符串 emit） */
const resizeW = ref(0)
const resizeH = ref(0)
const resizeX = ref(0)
const resizeY = ref(0)

/** 拉升起始快照 */
let rStartPX = 0
let rStartPY = 0
let rStartW = 0
let rStartH = 0
let rStartX = 0
let rStartY = 0
/** 当前拉升方向（存成变量供 document 监听回调读取） */
let rDir: ResizeDir = 'se'
let rPrevUserSelect = ''

/** 启动拉升 */
function startResize(e: MouseEvent, dir: ResizeDir) {
  if (!props.editing) return
  e.preventDefault()
  e.stopPropagation() // 阻止冒泡到 rootRef，避免同时触发拖动
  const el = rootRef.value
  if (!el) return

  rDir = dir
  rStartPX = e.clientX
  rStartPY = e.clientY
  // 起始尺寸用当前渲染尺寸（已解析为 px 数字）
  const rect = el.getBoundingClientRect()
  rStartW = rect.width
  rStartH = rect.height
  rStartX = props.card.x ?? 0
  rStartY = props.card.y ?? 0

  resizeW.value = rStartW
  resizeH.value = rStartH
  resizeX.value = rStartX
  resizeY.value = rStartY
  resizing.value = true

  // 禁止文本选中（同拖动）
  if (typeof document !== 'undefined') {
    rPrevUserSelect = document.body.style.userSelect
    document.body.style.userSelect = 'none'
  }

  document.addEventListener('mousemove', onResizeMouseMove)
  document.addEventListener('mouseup', endResize)
}

/** 拉升中：按方向计算新尺寸/位置，接入对齐吸附，最后 clamp 到最小值 */
function onResizeMouseMove(e: MouseEvent) {
  if (!resizing.value) return
  const dx = e.clientX - rStartPX
  const dy = e.clientY - rStartPY
  const dir = rDir

  // 宽：含 e(右) 增大，含 w(左) 减小
  let w = rStartW
  if (dir.includes('e')) w = rStartW + dx
  else if (dir.includes('w')) w = rStartW - dx
  // 高：含 s(下) 增大，含 n(上) 减小
  let h = rStartH
  if (dir.includes('s')) h = rStartH + dy
  else if (dir.includes('n')) h = rStartH - dy

  // 左/上拉伸：位置同步反向变化，保持右侧/下侧不动
  let x = rStartX
  let y = rStartY
  if (dir.includes('w')) x = rStartX + (rStartW - w)
  if (dir.includes('n')) y = rStartY + (rStartH - h)

  // 对齐吸附：用当前实时几何检测，吸附改尺寸/位置（对侧不动），同时出参考线
  const others = props.alignOthers ?? []
  if (others.length > 0) {
    const snapped = snapAlign({ x, y, w, h }, others, 6, dir)
    x = snapped.x
    y = snapped.y
    w = snapped.w
    h = snapped.h
  } else {
    clearLines()
  }

  // 最小尺寸 clamp（吸附后仍要约束，避免缩太小）
  if (w < MIN_W) {
    if (dir.includes('w')) x = rStartX + (rStartW - MIN_W) // 左边收缩过头，把 x 推回
    w = MIN_W
  }
  if (h < MIN_H) {
    if (dir.includes('n')) y = rStartY + (rStartH - MIN_H)
    h = MIN_H
  }

  resizeW.value = w
  resizeH.value = h
  resizeX.value = x
  resizeY.value = y
}

/** 结束拉升：解绑监听，格式化回字符串 emit 落库 */
function endResize() {
  if (!resizing.value) return
  resizing.value = false
  document.removeEventListener('mousemove', onResizeMouseMove)
  document.removeEventListener('mouseup', endResize)
  if (typeof document !== 'undefined') {
    document.body.style.userSelect = rPrevUserSelect
  }
  // 同步给 useDraggable 的 position（下次拖动从新位置起步）
  position.value = { x: resizeX.value, y: resizeY.value }
  emit('update-position', Math.round(resizeX.value), Math.round(resizeY.value))
  emit('update-size', `${Math.round(resizeW.value)}px`, `${Math.round(resizeH.value)}px`)
}

</script>

<template>
  <div
    ref="rootRef"
    class="editable-card"
    :class="{
      'is-editing': editing,
      'is-dragging': isDragging,
    }"
    :style="cardStyle"
  >
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

        <!-- 编辑控件（标题栏右侧：⚙ 设置 + ✕ 删除） -->
        <span v-if="editing" class="editable-card__controls" @click.stop @mousedown.stop>
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

    <!-- 8 向拉升手柄（仅编辑态）—— mousedown.stop 阻止冒泡，不触发卡片拖动 -->
    <template v-if="editing">
      <div
        v-for="dir in RESIZE_DIRS"
        :key="dir"
        :class="`editable-card__handle editable-card__handle--${dir}`"
        @mousedown.stop="(e) => startResize(e, dir)"
      />
    </template>

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
  /* 自由画布定位：position/left/top/transform/尺寸由 cardStyle 内联给出。
     display:flex 把显式 height 传给内部 TechCard，撑满卡片高度。 */
  display: flex;
  flex-direction: column;
  min-height: 0;
  transition: outline 0.15s ease, box-shadow 0.15s ease;
}

/* 编辑态：虚线描边 + 可拖动光标（左键拖动）；控件区按钮各自覆盖为自己的 cursor */
.editable-card.is-editing {
  outline: 1px dashed rgb(var(--primary-rgb) / 0.4);
  outline-offset: 2px;
  border-radius: var(--radius-md);
  cursor: move;
}

/* 拖动中：高亮描边（z-index 由 cardStyle 提权到 100），避免被其他卡片遮挡 */
.editable-card.is-dragging {
  outline: 1px solid var(--accent);
  outline-offset: 2px;
  box-shadow: 0 0 20px rgb(var(--primary-rgb) / 0.5);
  cursor: grabbing;
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

/* —— 8 向拉升手柄 ——
   绝对定位贴在卡片四边/四角，编辑态可见。
   命中区：边条 8px 宽（满边长），角块 12×12（优先命中角部双向拉伸）。
   用半透明主题色，hover/拖动时加亮。 */
.editable-card__handle {
  position: absolute;
  z-index: 10;
  background: rgb(var(--primary-rgb) / 0.5);
  border-radius: 2px;
  transition: background 0.15s ease;
}
.editable-card__handle:hover {
  background: var(--accent);
}

/* 四边（单方向） */
.editable-card__handle--n {
  top: -3px;
  left: 12px;
  right: 12px;
  height: 6px;
  cursor: ns-resize;
}
.editable-card__handle--s {
  bottom: -3px;
  left: 12px;
  right: 12px;
  height: 6px;
  cursor: ns-resize;
}
.editable-card__handle--e {
  right: -3px;
  top: 12px;
  bottom: 12px;
  width: 6px;
  cursor: ew-resize;
}
.editable-card__handle--w {
  left: -3px;
  top: 12px;
  bottom: 12px;
  width: 6px;
  cursor: ew-resize;
}

/* 四角（双向）—— 12×12，盖在边条之上（z-index 相同，后渲染在上） */
.editable-card__handle--ne {
  top: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
  cursor: nesw-resize;
}
.editable-card__handle--nw {
  top: -5px;
  left: -5px;
  width: 12px;
  height: 12px;
  cursor: nwse-resize;
}
.editable-card__handle--se {
  bottom: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
  cursor: nwse-resize;
}
.editable-card__handle--sw {
  bottom: -5px;
  left: -5px;
  width: 12px;
  height: 12px;
  cursor: nesw-resize;
}
</style>
