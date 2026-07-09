import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-popconfirm/Basic.vue'
import BasicSource from '../examples/tech-popconfirm/Basic.vue?raw'

export default {
  name: 'tech-popconfirm',
  title: 'Popconfirm 气泡确认框',
  category: '反馈与标识',
  description: '点击元素弹出小气泡确认框，轻量、不遮挡，适合危险操作二次确认。',
  intro: [
    '点击触发元素（默认插槽）弹出小气泡确认框：标题 + 确认/取消按钮。比 Dialog 更轻量，无遮罩、不遮挡其余内容。',
    '气泡用 Teleport 到 body 渲染，避免被父级 overflow 裁切；点击外部 / ESC / 取消按钮均可关闭。',
    '确认按钮支持 primary / danger 两种类型（删除等危险操作用 danger）。',
  ],
  demos: [{ title: '基础用法（确认/危险/方位）', component: Basic, source: BasicSource }],
  props: [
    { name: 'title', type: 'string', default: '-', desc: '标题（确认提示文案，必填）' },
    { name: 'confirmText', type: 'string', default: "'确认'", desc: '确认按钮文字' },
    { name: 'cancelText', type: 'string', default: "'取消'", desc: '取消按钮文字' },
    { name: 'confirmType', type: "'primary' | 'danger'", default: "'primary'", desc: '确认按钮类型（危险操作用 danger）' },
    { name: 'placement', type: "'top' | 'bottom'", default: "'top'", desc: '气泡弹出方位' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用（禁用时不弹出）' },
  ],
  slots: [{ name: 'default', desc: '触发元素（点击弹出气泡）' }],
  events: [
    { name: 'confirm', params: '-', desc: '点击确认按钮' },
    { name: 'cancel', params: '-', desc: '点击取消按钮' },
  ],
} satisfies ComponentDoc
