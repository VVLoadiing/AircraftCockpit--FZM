import type { ComponentDoc } from '../types'
import Basic from '../examples/status-dot/Basic.vue'
import BasicSource from '../examples/status-dot/Basic.vue?raw'

export default {
  name: 'status-dot',
  title: 'StatusDot 状态点',
  category: '反馈与标识',
  description: '设备 / 任务状态指示点。运行状态脉冲翠绿，错误状态闪烁。',
  intro: ['六种状态类型各有不同视觉与动效：running 脉冲、error 闪烁、standby/maintenance 静态发光，stopped/offline 无动效。'],
  demos: [{ title: '六种状态类型', component: Basic, source: BasicSource }],
  props: [
    { name: 'type', type: "'running' | 'standby' | 'stopped' | 'error' | 'maintenance' | 'offline'", default: "'running'", desc: '状态类型' },
    { name: 'label', type: 'string', default: "''", desc: "状态文字（不传则仅显示圆点；传 'auto' 则自动取 type 对应中文）" },
  ],
  slots: [{ name: 'default', desc: '自定义状态文字（覆盖 label）' }],
} satisfies ComponentDoc
