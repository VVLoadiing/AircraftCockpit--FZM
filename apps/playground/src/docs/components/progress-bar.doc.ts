import type { ComponentDoc } from '../types'
import Basic from '../examples/progress-bar/Basic.vue'
import BasicSource from '../examples/progress-bar/Basic.vue?raw'

export default {
  name: 'progress-bar',
  title: 'ProgressBar 进度条',
  category: '反馈与标识',
  description: '切角进度条，主题色渐变填充 + 流光 shimmer 效果。',
  intro: ['value 会自动 clamp 到 0-max 范围，无需手动限制。填充宽度变化带 0.4s 过渡动画，shimmer 流光默认开启。'],
  demos: [{ title: '语义色变体 + 流光开关', component: Basic, source: BasicSource }],
  props: [
    { name: 'value', type: 'number', default: "''", desc: '进度值（必填）' },
    { name: 'max', type: 'number', default: '100', desc: '最大值' },
    { name: 'type', type: "'' | 'success' | 'warning' | 'danger' | 'info'", default: "''", desc: '填充着色' },
    { name: 'shimmer', type: 'boolean', default: 'true', desc: '是否显示流光' },
    { name: 'showText', type: 'boolean', default: 'false', desc: '是否显示百分比文字' },
  ],
} satisfies ComponentDoc
