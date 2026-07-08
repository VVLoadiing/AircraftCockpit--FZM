<script setup lang="ts">
/**
 * CardSettingsPanel — 单张卡片的设置弹窗
 *
 * 用 FzGlass 玻璃浮窗作为壳，集中编辑一张卡片的所有属性：
 *   - 标题（TechInput）
 *   - 内容类型（TechSelect，带分类）
 *   - 宽度（TechInput，留空 = 跟随侧栏）
 *   - 高度（TechInput，留空 = fill 均分高度）
 *
 * 点击遮罩 / Esc / 关闭按钮 → emit('close')。
 * 字段即时双向同步到父级（@update-* 事件），父级再写回 layout。
 */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { FzGlass, FzGlassTitle, FzGlassClose, TechInput, TechSelect, HudButton } from '@fzm/ui'
import {
  CONTENT_TYPES,
  type EditableCard,
  type ContentType,
  type SelectOption,
} from '../../composables/useEditLayout'

const props = defineProps<{
  card: EditableCard
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update-title', title: string): void
  (e: 'update-content-type', type: ContentType): void
  (e: 'update-size', width: string | undefined, height: string | undefined): void
}>()

/** TechSelect options（带分类前缀） */
const typeOptions: SelectOption[] = CONTENT_TYPES.map((c) => ({
  label: `[${c.category}] ${c.label}`,
  value: c.type,
}))

/* —— 宽高本地草稿（输入时即时预览，避免每敲一个字就触发 emit 抖动） —— */
const widthDraft = ref(props.card.width ?? '')
const heightDraft = ref(props.card.height ?? '')

// 父级 card 变化（如切换了别的卡片 / 恢复默认）时同步草稿
watch(
  () => [props.card.id],
  () => {
    widthDraft.value = props.card.width ?? ''
    heightDraft.value = props.card.height ?? ''
  },
)

/** 尺寸输入处理：纯数字自动补 px，带单位的原样保留，非法则清空 */
function sanitizeSize(raw: string): string {
  const v = raw.trim()
  if (!v) return ''
  // 纯数字 → 补 px（最常见用法）
  if (/^\d*\.?\d+$/.test(v)) return `${v}px`
  // 已带单位 → 原样保留
  if (/^\d*\.?\d+(px|%|em|rem|vw|vh)?$/.test(v)) return v
  return ''
}

function commitWidth() {
  emit('update-size', sanitizeSize(widthDraft.value), undefined)
}
function commitHeight() {
  emit('update-size', undefined, sanitizeSize(heightDraft.value))
}

/** 类型 / 标题即时同步 */
function onTypeChange(val: string | number) {
  emit('update-content-type', val as ContentType)
}
function onTitleInput(val: string | number) {
  emit('update-title', String(val))
}

function onMaskClick() {
  emit('close')
}

/* Esc 关闭：挂在 window 上（弹窗内元素可能无焦点，挂在 mask div 不可靠） */
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <!-- Teleport 到 body：逃出 TechCard 的 clip-path，使弹窗真正浮在最外层 -->
  <Teleport to="body">
    <!-- 遮罩层（点击关闭；Esc 由 window 监听处理） -->
    <div class="settings-mask" @click.self="onMaskClick">
    <FzGlass tag="section" class="settings-panel" role="dialog" aria-modal="true">
      <!-- 标题条 -->
      <FzGlassTitle title="卡片设置" />
      <FzGlassClose class="settings-panel__close" @close="emit('close')" />

      <!-- 字段区 -->
      <div class="settings-panel__body">
        <!-- 标题 -->
        <label class="settings-panel__field">
          <span class="settings-panel__label">标题</span>
          <TechInput
            :model-value="card.title"
            placeholder="卡片标题"
            @update:model-value="onTitleInput"
          />
        </label>

        <!-- 内容类型 -->
        <label class="settings-panel__field">
          <span class="settings-panel__label">内容类型</span>
          <TechSelect
            :model-value="card.contentType"
            :options="typeOptions"
            @change="onTypeChange"
          />
        </label>

        <!-- 宽度 -->
        <label class="settings-panel__field">
          <span class="settings-panel__label">
            宽度
            <small class="settings-panel__hint">留空 = 跟随侧栏</small>
          </span>
          <TechInput
            v-model="widthDraft"
            type="text"
            placeholder="如 320px"
            suffix="px"
            @change="commitWidth"
            @blur="commitWidth"
          />
        </label>

        <!-- 高度 -->
        <label class="settings-panel__field">
          <span class="settings-panel__label">
            高度
            <small class="settings-panel__hint">留空 = fill 均分</small>
          </span>
          <TechInput
            v-model="heightDraft"
            type="text"
            placeholder="如 200px"
            suffix="px"
            @change="commitHeight"
            @blur="commitHeight"
          />
        </label>

        <!-- 当前尺寸预览 -->
        <div class="settings-panel__preview">
          当前：
          <span>{{ card.width ? card.width : '自动宽度' }}</span>
          <span class="settings-panel__dot">×</span>
          <span>{{ card.height ? card.height : 'fill 均分' }}</span>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="settings-panel__footer">
        <HudButton native-type="button" @click="emit('close')">完成</HudButton>
      </div>
    </FzGlass>
    </div>
  </Teleport>
</template>

<style scoped>
.settings-mask {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.5);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  animation: settings-fade-in 0.18s ease;
}

@keyframes settings-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.settings-panel {
  position: relative;
  width: 320px;
  max-width: calc(100vw - 32px);
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  /* 完全不透明：覆盖 FzGlass 的半透明玻璃底（同元素，用 !important 压过其 scoped 规则） */
  background: var(--bg-card-strong, #04111f) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  animation: settings-pop-in 0.2s cubic-bezier(0.2, 0.8, 0.3, 1.2);
}

@keyframes settings-pop-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 关闭按钮定位到右上角光区 */
.settings-panel__close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}

/* —— 字段区 —— */
.settings-panel__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-panel__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.settings-panel__label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-secondary);
}

.settings-panel__hint {
  font-size: 9.5px;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--text-muted);
  opacity: 0.85;
}

/* —— 尺寸预览 —— */
.settings-panel__preview {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  font-size: 10.5px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  background: rgb(var(--primary-rgb) / 0.08);
  border: 1px solid rgb(var(--primary-rgb) / 0.25);
  border-radius: var(--radius-sm);
}

.settings-panel__preview > span {
  color: var(--primary-lighter);
}

.settings-panel__dot {
  opacity: 0.5;
}

/* —— 底部 —— */
.settings-panel__footer {
  display: flex;
  justify-content: flex-end;
}
</style>
