import type { ComponentDoc } from '../types'
import Basic from '../examples/count-badge/Basic.vue'
import BasicSource from '../examples/count-badge/Basic.vue?raw'

export default {
  name: 'count-badge',
  title: 'CountBadge 计数徽章',
  category: '反馈与标识',
  description: '数字 / 计数徽章，切角 + 主题色边框。',
  intro: ['用于角标计数或简短状态文字。支持语义色变体。LevelBadge（告警等级）为同族组件，红/黄/蓝切角小标。'],
  demos: [{ title: 'CountBadge + LevelBadge', component: Basic, source: BasicSource }],
  props: [
    { name: 'value', type: 'string | number', default: "''", desc: '数值或文字（必填）' },
    { name: 'type', type: "'' | 'success' | 'warning' | 'danger' | 'info'", default: "''", desc: '着色（语义色变体）' },
  ],
} satisfies ComponentDoc
