<script setup lang="ts">
/**
 * EditModeView — 大屏自由画布编辑模式
 *
 * 所有卡片脱离侧栏，作为 .edit-mode 画布的直接子元素（absolute 定位），
 * 左键拖动到画布任意位置，松手自动持久化到 localStorage。
 *
 *   - 编辑态：可拖动 / 删除 / 改属性 / 新增卡片
 *   - 预览态：只读查看当前布局
 *   - 左下角浮动按钮：添加卡片（选类型 + 标题，确认后落在画布中部）
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { TechSelect, TechInput, HudButton, TechEmpty, FzGlass, FzGlassTitle, FzGlassClose } from '@fzm-tech-hud/ui'
import EditableCard from '../components/edit/EditableCard.vue'
import {
  useEditLayout,
  CONTENT_TYPES,
  type ContentType,
  type SelectOption,
} from '../composables/useEditLayout'
import type { CardGeom, AlignLine } from '../composables/useSnapAlign'

const {
  layout,
  addCard,
  removeCard,
  updateTitle,
  updateContentType,
  updateSize,
  updatePosition,
  resetLayout,
} = useEditLayout()

/** 编辑态开关（默认开启，进入即编辑） */
const editing = ref(true)

/** 画布容器（卡片拖动的边界 + 自由定位的参照系）—— 与 .edit-mode 同元素 */
const canvasRef = ref<HTMLElement | null>(null)

/**
 * 展平的卡片列表（left + right 合并），附带来源 side 用于增删改回写。
 * 数据仍按 {left,right} 分组存储（最小破坏 useEditLayout API），仅渲染层展平。
 */
interface FlatCard {
  id: string
  side: 'left' | 'right'
}
const allCards = computed<FlatCard[]>(() => [
  ...layout.value.left.map((c) => ({ id: c.id, side: 'left' as const })),
  ...layout.value.right.map((c) => ({ id: c.id, side: 'right' as const })),
])

/** 按 id 查卡片数据（避免 v-for 里嵌套查找） */
function getCard(side: 'left' | 'right', id: string) {
  return layout.value[side].find((c) => c.id === id)!
}

/* —— 对齐辅助线 ——
   卡片拖动时 emit('align-lines') 回传当前参考线，存在本地 ref 驱动顶层渲染。
   拖动结束卡片会 emit 空数组，线自动消失。 */
const alignLines = ref<AlignLine[]>([])

/** 把卡片数据转成几何信息（解析 width/height 字符串为数字） */
function toGeom(card: { x?: number; y?: number; width?: string; height?: string }): CardGeom {
  return {
    x: card.x ?? 0,
    y: card.y ?? 0,
    w: parseInt(card.width || '320', 10),
    h: parseInt(card.height || '200', 10),
  }
}

/** 取「除指定 id 外」的所有卡片几何（供该卡片拖动时对齐） */
function othersGeom(excludeId: string): CardGeom[] {
  return allCards.value
    .filter((c) => c.id !== excludeId)
    .map((c) => toGeom(getCard(c.side, c.id)))
}

/* —— 添加面板（画布左下角浮动） —— */
const showAddPanel = ref(false)
const draftType = ref<ContentType>('line')
const draftTitle = ref('')

const typeOptions: SelectOption[] = CONTENT_TYPES.map((c) => ({
  label: `[${c.category}] ${c.label}`,
  value: c.type,
}))

function confirmAdd() {
  // 新增卡片统一归到 left（渲染层展平，side 不影响位置；仅作数据归属）
  addCard('left', draftType.value, draftTitle.value)
  draftType.value = 'line'
  draftTitle.value = ''
  showAddPanel.value = false
}

function onTypeChange(val: string | number) {
  draftType.value = val as ContentType
}

/* Esc 关闭添加卡片弹窗 */
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') showAddPanel.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div ref="canvasRef" class="edit-mode">
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
        {{ editing ? '编辑态：拖动卡片改位置，拖边缘手柄改大小' : '预览态：只读查看当前布局' }}
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

    <!-- 自由画布：所有卡片 absolute 直接挂在此容器上 -->
    <EditableCard
      v-for="(item, i) in allCards"
      :key="item.id"
      :card="getCard(item.side, item.id)"
      :editing="editing"
      :canvas="canvasRef"
      :z-index="i + 1"
      :align-others="othersGeom(item.id)"
      @remove="removeCard(item.side, item.id)"
      @update-content-type="(t) => updateContentType(item.side, item.id, t)"
      @update-title="(t) => updateTitle(item.side, item.id, t)"
      @update-size="(w, h) => updateSize(item.side, item.id, w, h)"
      @update-position="(x, y) => updatePosition(item.side, item.id, x, y)"
      @align-lines="(lines) => (alignLines = lines)"
    />

    <!-- 对齐辅助线层（拖动时由卡片回传，覆盖在卡片之上） -->
    <div class="edit-mode__align-lines" aria-hidden="true">
      <div
        v-for="(line, i) in alignLines"
        :key="i"
        class="edit-mode__align-line"
        :class="`edit-mode__align-line--${line.axis}`"
        :style="
          line.axis === 'x'
            ? { left: `${line.pos}px`, top: `${line.from}px`, height: `${line.to - line.from}px` }
            : { top: `${line.pos}px`, left: `${line.from}px`, width: `${line.to - line.from}px` }
        "
      />
    </div>

    <!-- 空状态（无卡片时画布中央提示） -->
    <div v-if="allCards.length === 0" class="edit-mode__empty">
      <TechEmpty description="画布为空，点左下角按钮添加卡片" />
    </div>

    <!-- 左下角圆形浮动添加按钮（仅编辑态） -->
    <template v-if="editing">
      <button
        type="button"
        class="edit-mode__fab"
        :class="{ 'is-open': showAddPanel }"
        :title="showAddPanel ? '收起' : '添加卡片'"
        @click="showAddPanel = !showAddPanel"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      <!-- 添加卡片弹窗（Teleport 到 body，逃出画布层级） -->
      <Teleport to="body">
        <transition name="add-mask">
          <div v-if="showAddPanel" class="add-mask" @click.self="showAddPanel = false">
            <FzGlass tag="section" class="add-modal" role="dialog" aria-modal="true">
              <FzGlassTitle title="添加卡片" />
              <FzGlassClose class="add-modal__close" @close="showAddPanel = false" />

              <div class="add-modal__body">
                <div class="add-modal__field">
                  <span class="add-modal__label">内容类型</span>
                  <TechSelect
                    :model-value="draftType"
                    :options="typeOptions"
                    @change="(v: string | number) => onTypeChange(v)"
                  />
                </div>
                <label class="add-modal__field">
                  <span class="add-modal__label">标题（可选）</span>
                  <TechInput
                    v-model="draftTitle"
                    placeholder="留空使用类型名"
                  />
                </label>
              </div>

              <div class="add-modal__footer">
                <HudButton native-type="button" @click="showAddPanel = false">取消</HudButton>
                <HudButton type="primary" native-type="button" @click="confirmAdd">确认添加</HudButton>
              </div>
            </FzGlass>
          </div>
        </transition>
      </Teleport>
    </template>
  </div>
</template>

<style scoped>
/*
 * 自由画布：容器 fixed 占满视口，卡片 absolute 直接挂在此层（不再有侧栏夹层）。
 * 容器不裁剪卡片（无 overflow:hidden），拖出工具栏区域也能正常显示。
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
  max-width: calc(100% - 40px);
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

/* —— 空状态（画布中央） —— */
.edit-mode__empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/* —— 左下角圆形浮动添加按钮（FAB） —— */
.edit-mode__fab {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 14;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  color: var(--text-on-primary);
  background: var(--primary-gradient);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
  box-shadow: 0 4px 16px rgb(var(--primary-rgb) / 0.5);
}

.edit-mode__fab:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 22px rgb(var(--primary-rgb) / 0.65);
}

/* 打开时 + 旋转成 × */
.edit-mode__fab.is-open {
  transform: rotate(45deg);
  background: var(--bg-hover);
  color: var(--text-primary);
  border: 1px solid var(--border-strong);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

.edit-mode__fab.is-open:hover {
  transform: rotate(45deg) scale(1.08);
}

/* —— 添加卡片弹窗 —— */
.add-mask {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.5);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

.add-modal {
  position: relative;
  width: 320px;
  max-width: calc(100vw - 32px);
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  /* 完全不透明：压过 FzGlass 半透明底（同元素 scoped 规则） */
  background: var(--bg-card-strong, #04111f) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

.add-modal__close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}

.add-modal__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.add-modal__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.add-modal__label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-secondary);
}

.add-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 弹窗遮罩淡入淡出 */
.add-mask-enter-active,
.add-mask-leave-active {
  transition: opacity 0.18s ease;
}

.add-mask-enter-from,
.add-mask-leave-to {
  opacity: 0;
}

/* —— 对齐辅助线 ——
   拖动卡片接近其他卡片边缘/中线时显示；覆盖在卡片之上但不拦截交互。
   竖线(--x)宽 1px、横线(--y)高 1px，主题色半透明。 */
.edit-mode__align-lines {
  position: absolute;
  inset: 0;
  z-index: 50;
  pointer-events: none;
}

.edit-mode__align-line {
  position: absolute;
  /* 高对比虚线：用 repeating-linear-gradient 自绘，可控疏密 + 颜色。
     配色用亮黄/亮青交替，在深色画布上醒目；加强发光。 */
}

/* 竖线：宽 2px，竖直方向 repeating 虚线（实 5px 空 4px） */
.edit-mode__align-line--x {
  width: 2px;
  margin-left: -1px;
  background-image: repeating-linear-gradient(
    to bottom,
    var(--accent, #00d4ff) 0,
    var(--accent, #00d4ff) 5px,
    transparent 5px,
    transparent 9px
  );
  box-shadow: 0 0 6px rgb(var(--primary-rgb) / 0.8);
}

/* 横线：高 2px，水平方向 repeating 虚线 */
.edit-mode__align-line--y {
  height: 2px;
  margin-top: -1px;
  background-image: repeating-linear-gradient(
    to right,
    var(--accent, #00d4ff) 0,
    var(--accent, #00d4ff) 5px,
    transparent 5px,
    transparent 9px
  );
  box-shadow: 0 0 6px rgb(var(--primary-rgb) / 0.8);
}
</style>
