import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-avatar/Basic.vue'
import BasicSource from '../examples/tech-avatar/Basic.vue?raw'

export default {
  name: 'tech-avatar',
  title: 'TechAvatar 头像',
  category: '反馈与标识',
  description: '切角容器 + 图片/文字 fallback + 可选状态点。用户头像、设备图标、工位标识。',
  intro: ['无 src 或图片加载失败时显示文字：中文取首个字符，英文取前两个字符并大写。右下角可叠加状态点（与 StatusDot 同色系）。'],
  demos: [{ title: '文字 fallback + 状态点', component: Basic, source: BasicSource }],
  props: [
    { name: 'src', type: 'string', default: "''", desc: '图片地址（无效或未传时显示文字）' },
    { name: 'text', type: 'string', default: "''", desc: '文字（取首字/前两字母）' },
    { name: 'size', type: 'number', default: '36', desc: '尺寸（px）' },
    { name: 'shape', type: "'square' | 'circle'", default: "'square'", desc: '形状（square 为切角）' },
    { name: 'status', type: "'' | 'running' | 'standby' | 'stopped' | 'error' | 'maintenance' | 'offline'", default: "''", desc: '状态点' },
  ],
} satisfies ComponentDoc
