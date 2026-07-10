<script setup lang="ts">
import { ref } from 'vue'
import { TechUpload, HudButton, Segmented, Message, ProgressBar } from '@fzm-tech-hud/ui'
import type { UploadFile } from '@fzm-tech-hud/ui'
import { uploadToOss, uploadToServer, type UploadMode, type ProgressInfo, type UploadResult } from '../../../services/upload'

/** 上传通道（mock 模式，不连真实后端也能跑通完整流程） */
const mode = ref<UploadMode>('oss')

function switchMode(v: string | number) {
  mode.value = v as UploadMode
  Message.info(`已切换为「${mode.value === 'oss' ? 'OSS 直传' : '服务器中转'}」通道（mock）`)
}

/**
 * 极简上传：按当前通道调用 uploadToOss / uploadToServer，
 * 只传必要参数（接口地址 + dir + 进度），region/bucket 由后端 STS 返回。
 */
function doUpload(file: File, onProgress: (info: ProgressInfo) => void): Promise<UploadResult> {
  if (mode.value === 'oss') {
    return uploadToOss(file, {
      stsApi: '/api/upload/sts',
      dir: 'demo',
      onProgress,
      useMock: true, // 演示用；接真实后端时去掉
    })
  }
  return uploadToServer(file, {
    serverApi: '/api/upload/file',
    dir: 'demo',
    onProgress,
    useMock: true,
  })
}

/** 上传任务（带进度） */
interface Task {
  uid: number
  name: string
  size: number
  percent: number
  status: 'uploading' | 'done' | 'error'
  url?: string
  error?: string
}
const tasks = ref<Task[]>([])
const uploading = ref(false)

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

/** 选文件后触发上传 */
async function startUpload(files: UploadFile[]) {
  if (uploading.value) return
  uploading.value = true

  // 为本次新增的文件创建上传任务
  const newTasks: Task[] = files.map((f) => ({
    uid: f.uid,
    name: f.name,
    size: f.size,
    percent: 0,
    status: 'uploading',
  }))
  tasks.value.push(...newTasks)

  // 逐个上传（也可并发，这里逐个便于观察进度）
  for (const f of files) {
    const task = tasks.value.find((t) => t.uid === f.uid)
    if (!task) continue
    try {
      const result = await doUpload(f.raw, (info: ProgressInfo) => {
        task.percent = info.percent
      })
      task.status = 'done'
      task.percent = 100
      task.url = result.url
    } catch (e) {
      task.status = 'error'
      task.error = e instanceof Error ? e.message : String(e)
    }
  }

  uploading.value = false
  const ok = newTasks.filter((t) => t.status === 'done').length
  Message.success(`${ok}/${files.length} 个文件上传完成（mock 模式）`)
}

function clearTasks() {
  tasks.value = []
}
</script>

<template>
  <div style="max-width: 480px">
    <!-- 通道切换 -->
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px">
      <span style="font-size: 12px; color: var(--text-secondary)">上传通道</span>
      <Segmented
        :model-value="mode"
        :items="[
          { value: 'oss', label: 'OSS 直传' },
          { value: 'server', label: '服务器中转' },
        ]"
        @change="(v) => switchMode(v)"
      />
      <span style="font-size: 10.5px; color: var(--text-muted); opacity: 0.7">mock 模式（不连真实后端）</span>
    </div>

    <!-- 上传组件（选文件后立即触发上传） -->
    <TechUpload
      type="drag"
      multiple
      hint="选择文件后自动调用 upload service 上传（mock）"
      @select="startUpload"
    />

    <!-- 上传任务列表（进度） -->
    <ul v-if="tasks.length" class="tasks">
      <li v-for="t in tasks" :key="t.uid" class="task" :class="`is-${t.status}`">
        <div class="task__head">
          <span class="task__name">{{ t.name }}</span>
          <span class="task__size">{{ formatSize(t.size) }}</span>
          <span v-if="t.status === 'uploading'" class="task__status">{{ t.percent }}%</span>
          <span v-else-if="t.status === 'done'" class="task__status">✓ 完成</span>
          <span v-else class="task__status task__status--err">✗ 失败</span>
        </div>
        <ProgressBar
          v-if="t.status !== 'error'"
          :value="t.percent"
          :type="t.status === 'done' ? 'success' : 'info'"
          :shimmer="t.status === 'uploading'"
        />
        <p v-else class="task__error">{{ t.error }}</p>
        <a v-if="t.url" :href="t.url" class="task__url" target="_blank" rel="noopener">{{ t.url }}</a>
      </li>
    </ul>

    <div v-if="tasks.length" style="margin-top: 10px">
      <HudButton @click="clearTasks">清空记录</HudButton>
    </div>
  </div>
</template>

<style scoped>
.tasks {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task {
  padding: 10px 12px;
  background: rgb(var(--primary-rgb) / 0.06);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
}

.task__head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 7px;
}

.task__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: var(--text-primary);
}

.task__size {
  flex-shrink: 0;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-muted);
  opacity: 0.7;
}

.task__status {
  flex-shrink: 0;
  font-size: 11px;
  color: var(--success-light);
}

.task__status--err {
  color: var(--danger-light);
}

.task__btn {
  flex-shrink: 0;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: inherit;
}

.task__btn:hover {
  color: var(--danger-light);
  border-color: rgb(var(--danger-rgb) / 0.5);
}

.task__error {
  margin: 0;
  font-size: 11px;
  color: var(--danger-light);
}

.task__url {
  display: block;
  margin-top: 6px;
  font-size: 10.5px;
  font-family: var(--font-mono);
  color: var(--primary-lighter);
  text-decoration: none;
  word-break: break-all;
}

.task__url:hover {
  text-decoration: underline;
}
</style>
