<script setup lang="ts">
import { ref, computed } from 'vue'
import { TechUpload, HudButton, Message } from '@fzm-tech-hud/ui'
import type { UploadFile } from '@fzm-tech-hud/ui'

const dragFiles = ref<UploadFile[]>([])
const btnFiles = ref<UploadFile[]>([])
const imgFiles = ref<UploadFile[]>([])

function onSelect(files: UploadFile[]) {
  Message.success(`已选择 ${files.length} 个文件`)
}

function onError(msg: string) {
  Message.warning(msg)
}

function onRemove(file: UploadFile) {
  Message.info(`已移除 ${file.name}`)
}

/* —— 打印已选文件信息（不上传，仅读取展示） —— */
const allFiles = computed(() => [...dragFiles.value, ...btnFiles.value, ...imgFiles.value])

/** 页面展示用的摘要（去掉 File 对象，只留可读信息） */
const printText = ref('')

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

function printFiles() {
  if (allFiles.value.length === 0) {
    Message.warning('还没有选择任何文件')
    printText.value = ''
    return
  }
  // 摘要信息（name / size / type / lastModified）
  const info = allFiles.value.map((f) => ({
    name: f.name,
    size: formatSize(f.size),
    type: f.raw.type || '(未知类型)',
    lastModified: new Date(f.raw.lastModified).toLocaleString(),
  }))
  // 控制台打印（完整，含原始 File 对象）
  console.log('[TechUpload] 已选文件：', allFiles.value)
  console.table(info)
  // 页面展示
  printText.value = JSON.stringify(info, null, 2)
  Message.success(`已打印 ${info.length} 个文件信息（查看控制台 / 下方）`)
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 32px; max-width: 420px">
    <!-- 1. 拖拽上传区 -->
    <div>
      <p style="font-size: 12px; color: var(--text-secondary); margin: 0 0 10px">拖拽上传区（多选，单文件 ≤ 2MB）</p>
      <TechUpload
        v-model="dragFiles"
        type="drag"
        multiple
        :max-size="2"
        hint="支持任意类型文件，单个不超过 2MB"
        @select="onSelect"
        @error="onError"
        @remove="onRemove"
      />
    </div>

    <!-- 2. 按钮 + 文件列表 -->
    <div>
      <p style="font-size: 12px; color: var(--text-secondary); margin: 0 0 10px">按钮 + 文件列表（限 3 个）</p>
      <TechUpload
        v-model="btnFiles"
        type="button"
        multiple
        :limit="3"
        @select="onSelect"
        @error="onError"
      />
    </div>

    <!-- 3. 图片缩略图 -->
    <div>
      <p style="font-size: 12px; color: var(--text-secondary); margin: 0 0 10px">图片缩略图（accept image，限 4 张）</p>
      <TechUpload
        v-model="imgFiles"
        type="image"
        accept="image/*"
        multiple
        :limit="4"
        @select="onSelect"
        @error="onError"
      />
    </div>

    <!-- 打印按钮 + 信息展示 -->
    <div>
      <div style="display: flex; align-items: center; gap: 12px">
        <HudButton type="primary" @click="printFiles">打印已选文件信息</HudButton>
        <span style="font-size: 11px; color: var(--text-muted); opacity: 0.7">共 {{ allFiles.length }} 个文件（输出到控制台 + 下方）</span>
      </div>
      <pre v-if="printText" class="print-out"><code>{{ printText }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.print-out {
  margin: 10px 0 0;
  padding: 12px 14px;
  max-height: 240px;
  overflow: auto;
  font-family: var(--font-mono, monospace);
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--text-secondary);
  background: rgb(0 0 0 / 0.3);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  white-space: pre-wrap;
  word-break: break-all;
  scrollbar-width: thin;
}
</style>
