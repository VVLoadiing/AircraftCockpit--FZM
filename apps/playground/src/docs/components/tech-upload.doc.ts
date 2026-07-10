import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-upload/Basic.vue'
import BasicSource from '../examples/tech-upload/Basic.vue?raw'
import Service from '../examples/tech-upload/Service.vue'
import ServiceSource from '../examples/tech-upload/Service.vue?raw'

export default {
  name: 'tech-upload',
  title: 'TechUpload 上传',
  category: '输入与导航',
  description: '科技风上传组件，拖拽区 / 按钮+列表 / 图片缩略图三种模式，只选文件不传。',
  intro: [
    '三种展示模式（type prop）：drag 拖拽上传区、button 按钮+文件列表、image 图片缩略图网格（含点击预览）。',
    '只负责选文件，不发送请求：选中后 emit change/select 把 File 交给业务自行处理上传（如调 SDK、分片）。',
    '支持 v-model 双向绑定文件数组；accept 类型过滤、multiple 多选、maxSize 单文件大小限制、limit 数量限制。',
    '内置校验：超大小/超数量/类型不符时 emit error，可用 Message 提示用户。',
    '下方「配合 upload service」示例演示如何与 services/upload 集成：选文件后调用统一的 upload()，支持 OSS 直传 / 服务器中转两种通道（mock 模式可跑通完整流程），实时进度与结果 URL。',
  ],
  demos: [
    { title: '三种模式（拖拽 / 按钮 / 图片）', component: Basic, source: BasicSource },
    { title: '配合 upload service（OSS 直传 / 服务器中转）', component: Service, source: ServiceSource },
  ],
  props: [
    { name: 'modelValue', type: 'UploadFile[]', default: '[]', desc: 'v-model 绑定值（已选文件数组）' },
    { name: 'type', type: "'drag' | 'button' | 'image'", default: "'drag'", desc: '展示模式' },
    { name: 'accept', type: 'string', default: "''", desc: "接受的文件类型（原生 accept，如 'image/*'、'.pdf'）" },
    { name: 'multiple', type: 'boolean', default: 'false', desc: '是否多选' },
    { name: 'maxSize', type: 'number', default: '0', desc: '单文件大小上限（MB），0 不限' },
    { name: 'limit', type: 'number', default: '0', desc: '最大文件数量（0 不限）' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
    { name: 'text', type: 'string', default: "'点击或拖拽文件到此处'", desc: '拖拽区文字（drag 模式）' },
    { name: 'hint', type: 'string', default: "''", desc: '拖拽区提示（drag 模式）' },
  ],
  events: [
    { name: 'change', params: '(files: UploadFile[])', desc: '文件变化时触发（已选的全部）' },
    { name: 'select', params: '(files: UploadFile[])', desc: '每次新增时触发（本次新增的）' },
    { name: 'remove', params: '(file: UploadFile)', desc: '删除文件时触发（被删的）' },
    { name: 'error', params: '(message: string)', desc: '校验失败（超大小/超数量/类型不符）' },
  ],
} satisfies ComponentDoc
