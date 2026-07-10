<script setup lang="ts">
/**
 * TechUpload — 科技风上传组件
 *
 * 三种展示模式（type prop）：
 *  - drag：拖拽上传区（虚线框 + 图标 + 文字，hover/dragover 辉光）
 *  - button：按钮触发 + 文件列表（名称/大小/删除）
 *  - image：图片缩略图网格（含预览、删除）
 *
 * 只负责选文件，不发送请求：选中后 emit('change', files)，业务自行处理上传。
 * 支持 accept（类型过滤）、multiple（多选）、maxSize（单文件大小限制）、limit（数量限制）。
 */
import { ref, computed, watch } from 'vue'

/** 单个文件项 */
export interface UploadFile {
  /** 唯一标识 */
  uid: number
  /** 原始 File */
  raw: File
  /** 文件名 */
  name: string
  /** 字节大小 */
  size: number
  /** 缩略图 URL（图片模式，objectURL） */
  url?: string
  /** 状态 */
  status: 'ready' | 'error'
  /** 错误信息（超大小/类型不符等） */
  error?: string
}

const props = withDefaults(
  defineProps<{
    /** v-model 绑定值（已选文件数组，可选；不传则组件自管） */
    modelValue?: UploadFile[]
    /** 展示模式 */
    type?: 'drag' | 'button' | 'image'
    /** 接受的文件类型（原生 accept，如 'image/*'、'.pdf'） */
    accept?: string
    /** 是否多选 */
    multiple?: boolean
    /** 单文件大小上限（MB），0 不限 */
    maxSize?: number
    /** 最大文件数量（0 不限） */
    limit?: number
    /** 禁用 */
    disabled?: boolean
    /** 拖拽区文字（drag 模式） */
    text?: string
    /** 拖拽区提示（drag 模式） */
    hint?: string
  }>(),
  {
    modelValue: () => [],
    type: 'drag',
    accept: '',
    multiple: false,
    maxSize: 0,
    limit: 0,
    disabled: false,
    text: '点击或拖拽文件到此处',
    hint: '',
  },
)

const emit = defineEmits<{
  /** v-model 更新 */
  (e: 'update:modelValue', files: UploadFile[]): void
  /** 文件选择/变化时触发（已选的全部文件） */
  (e: 'change', files: UploadFile[]): void
  /** 每次新增文件时触发（本次新增的） */
  (e: 'select', files: UploadFile[]): void
  /** 删除文件时触发（被删的文件） */
  (e: 'remove', file: UploadFile): void
  /** 校验失败（超大小/超数量/类型不符） */
  (e: 'error', message: string): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
/** 已选文件列表（受 modelValue 初始化，内部可改） */
const files = ref<UploadFile[]>(props.modelValue ? [...props.modelValue] : [])
/** 拖拽悬停态 */
const dragover = ref(false)
/** 图片预览 */
const previewUrl = ref('')
let uidSeed = 0

/** files 变化时同步到 v-model + emit change */
function syncOut() {
  emit('update:modelValue', files.value)
  emit('change', files.value)
}

// 外部 modelValue 变化时同步进来（受控模式）
watch(
  () => props.modelValue,
  (val) => {
    if (val && val !== files.value) files.value = [...val]
  },
)

/** 是否图片模式 */
const isImage = computed(() => props.type === 'image')

/** 格式化文件大小 */
function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

/** 校验单个文件 */
function validate(file: File): string | null {
  if (props.maxSize > 0 && file.size > props.maxSize * 1024 * 1024) {
    return `${file.name} 超过 ${props.maxSize}MB 限制`
  }
  return null
}

/** 处理选中的 FileList */
function handleFiles(fileList: FileList | null) {
  if (!fileList || fileList.length === 0) return
  if (props.disabled) return

  const incoming = Array.from(fileList)
  const added: UploadFile[] = []
  const errors: string[] = []

  for (const raw of incoming) {
    // 数量限制
    if (props.limit > 0 && files.value.length + added.length >= props.limit) {
      errors.push(`最多只能上传 ${props.limit} 个文件`)
      break
    }
    const err = validate(raw)
    if (err) {
      errors.push(err)
      continue
    }
    const item: UploadFile = {
      uid: ++uidSeed,
      raw,
      name: raw.name,
      size: raw.size,
      status: 'ready',
    }
    // 图片模式生成缩略图
    if (isImage.value && raw.type.startsWith('image/')) {
      item.url = URL.createObjectURL(raw)
    }
    added.push(item)
  }

  if (added.length) {
    if (props.multiple) {
      files.value.push(...added)
    } else {
      // 单选模式：替换。先释放旧 objectURL
      files.value.forEach((f) => f.url && URL.revokeObjectURL(f.url))
      files.value = added
    }
    emit('select', added)
    syncOut()
  }

  if (errors.length) {
    emit('error', errors[0])
  }

  // 重置 input value，允许重复选同一文件
  if (inputRef.value) inputRef.value.value = ''
}

function openPicker() {
  if (props.disabled) return
  inputRef.value?.click()
}

function onInputChange(e: Event) {
  handleFiles((e.target as HTMLInputElement).files)
}

/* —— 拖拽 —— */
function onDrop(e: DragEvent) {
  dragover.value = false
  if (props.disabled) return
  handleFiles(e.dataTransfer?.files ?? null)
}
function onDragover(e: DragEvent) {
  if (props.disabled) return
  e.preventDefault()
  dragover.value = true
}
function onDragleave() {
  dragover.value = false
}

/* —— 删除/预览 —— */
function remove(file: UploadFile) {
  const idx = files.value.indexOf(file)
  if (idx === -1) return
  if (file.url) URL.revokeObjectURL(file.url)
  files.value.splice(idx, 1)
  emit('remove', file)
  syncOut()
}

function preview(file: UploadFile) {
  if (file.url) previewUrl.value = file.url
}

/** 清空全部（暴露给业务） */
function clear() {
  files.value.forEach((f) => f.url && URL.revokeObjectURL(f.url))
  files.value = []
  syncOut()
}

defineExpose({ clear, files })
</script>

<template>
  <div class="fzm-upload" :class="[`is-${type}`, { 'is-disabled': disabled }]">
    <!-- 隐藏的 file input -->
    <input
      ref="inputRef"
      type="file"
      class="fzm-upload__input"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="onInputChange"
    />

    <!-- ========== 1. 拖拽上传区 ========== -->
    <div
      v-if="type === 'drag'"
      class="fzm-upload__zone"
      :class="{ 'is-dragover': dragover }"
      @click="openPicker"
      @drop="onDrop"
      @dragover="onDragover"
      @dragleave="onDragleave"
    >
      <svg class="fzm-upload__zone-icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
      </svg>
      <p class="fzm-upload__zone-text">{{ text }}</p>
      <p v-if="hint" class="fzm-upload__zone-hint">{{ hint }}</p>
    </div>

    <!-- ========== 2. 按钮 + 文件列表 ========== -->
    <div v-else-if="type === 'button'" class="fzm-upload__button-wrap">
      <button type="button" class="fzm-upload__btn" :disabled="disabled" @click="openPicker">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        选择文件
      </button>
      <span v-if="limit" class="fzm-upload__count">{{ files.length }}/{{ limit }}</span>
    </div>

    <!-- 文件列表（button / drag 共用） -->
    <TransitionGroup v-if="type !== 'image' && files.length" name="fzm-upload" tag="ul" class="fzm-upload__list">
      <li v-for="f in files" :key="f.uid" class="fzm-upload__item" :class="{ 'is-error': f.status === 'error' }">
        <svg class="fzm-upload__file-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" />
        </svg>
        <span class="fzm-upload__file-name">{{ f.name }}</span>
        <span class="fzm-upload__file-size">{{ formatSize(f.size) }}</span>
        <button type="button" class="fzm-upload__remove" @click="remove(f)">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </li>
    </TransitionGroup>

    <!-- ========== 3. 图片缩略图网格 ========== -->
    <div v-if="type === 'image'" class="fzm-upload__image-grid">
      <div v-for="f in files" :key="f.uid" class="fzm-upload__image-item">
        <img v-if="f.url" :src="f.url" class="fzm-upload__thumb" @click="preview(f)" />
        <div v-else class="fzm-upload__thumb fzm-upload__thumb--empty">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
        </div>
        <button type="button" class="fzm-upload__image-remove" @click="remove(f)">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
      <!-- 添加按钮（未达 limit 时） -->
      <div v-if="!limit || files.length < limit" class="fzm-upload__image-add" @click="openPicker">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
      </div>
    </div>

    <!-- 图片预览遮罩 -->
    <Teleport to="body">
      <Transition name="fzm-upload-preview">
        <div v-if="previewUrl" class="fzm-upload__preview" @click="previewUrl = ''">
          <img :src="previewUrl" class="fzm-upload__preview-img" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fzm-upload__input {
  display: none;
}

.fzm-upload.is-disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* —— 1. 拖拽上传区 —— */
.fzm-upload__zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 20px;
  width: 100%;
  border: 1px dashed rgb(var(--primary-rgb) / 0.4);
  border-radius: var(--radius-md);
  background: rgb(var(--primary-rgb) / 0.04);
  cursor: pointer;
  transition: all 0.2s ease;
}

.fzm-upload__zone:hover,
.fzm-upload__zone.is-dragover {
  border-color: var(--primary);
  background: rgb(var(--primary-rgb) / 0.1);
  box-shadow: 0 0 0 1px rgb(var(--primary-rgb) / 0.3), 0 0 18px rgb(var(--primary-rgb) / 0.2);
}

.fzm-upload__zone-icon {
  color: var(--primary-light);
  transition: color 0.2s ease;
}
.fzm-upload__zone:hover .fzm-upload__zone-icon,
.fzm-upload__zone.is-dragover .fzm-upload__zone-icon {
  color: var(--primary);
}

.fzm-upload__zone-text {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.fzm-upload__zone-hint {
  margin: 0;
  font-size: 11px;
  color: var(--text-muted);
  opacity: 0.7;
}

/* —— 2. 按钮 —— */
.fzm-upload__button-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.fzm-upload__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 12px;
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

.fzm-upload__btn:hover:not(:disabled) {
  color: var(--accent-light);
  background: rgb(var(--primary-rgb) / 0.22);
  border-color: var(--accent);
}

.fzm-upload__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fzm-upload__count {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-muted);
  opacity: 0.7;
}

/* —— 文件列表 —— */
.fzm-upload__list {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fzm-upload__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  font-size: 12px;
  color: var(--text-secondary);
  background: rgb(var(--primary-rgb) / 0.06);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  transition: all 0.18s ease;
}

.fzm-upload__item:hover {
  border-color: var(--border-strong);
  background: rgb(var(--primary-rgb) / 0.1);
}

.fzm-upload__item.is-error {
  border-color: rgb(var(--danger-rgb) / 0.5);
}

.fzm-upload__file-icon {
  color: var(--primary-light);
  flex-shrink: 0;
}

.fzm-upload__file-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-primary);
}

.fzm-upload__file-size {
  flex-shrink: 0;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-muted);
  opacity: 0.7;
}

.fzm-upload__remove {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.18s ease;
  padding: 0;
}

.fzm-upload__remove:hover {
  color: #fff;
  background: rgb(var(--danger-rgb) / 0.5);
}

/* —— 3. 图片缩略图网格 —— */
.fzm-upload__image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.fzm-upload__image-item {
  position: relative;
  width: 84px;
  height: 84px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: rgb(var(--primary-rgb) / 0.06);
}

.fzm-upload__thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.fzm-upload__thumb--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.fzm-upload__image-remove {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
  border: none;
  cursor: pointer;
  transition: background 0.18s ease;
  padding: 0;
  opacity: 0;
}

.fzm-upload__image-item:hover .fzm-upload__image-remove {
  opacity: 1;
}
.fzm-upload__image-remove:hover {
  background: rgb(var(--danger-rgb) / 0.8);
}

/* 添加按钮格 */
.fzm-upload__image-add {
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgb(var(--primary-rgb) / 0.4);
  border-radius: var(--radius-sm);
  color: var(--primary-light);
  background: rgb(var(--primary-rgb) / 0.04);
  cursor: pointer;
  transition: all 0.2s ease;
}

.fzm-upload__image-add:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgb(var(--primary-rgb) / 0.1);
}

/* —— 列表过渡 —— */
.fzm-upload-enter-active,
.fzm-upload-leave-active {
  transition: all 0.25s ease;
}
.fzm-upload-enter-from,
.fzm-upload-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
.fzm-upload-leave-active {
  position: absolute;
}

/* —— 图片预览遮罩 —— */
.fzm-upload__preview {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: rgba(0, 4, 10, 0.7);
  backdrop-filter: blur(4px);
  cursor: zoom-out;
}

.fzm-upload__preview-img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: var(--radius-md);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.fzm-upload-preview-enter-active,
.fzm-upload-preview-leave-active {
  transition: opacity 0.2s ease;
}
.fzm-upload-preview-enter-from,
.fzm-upload-preview-leave-to {
  opacity: 0;
}
</style>
