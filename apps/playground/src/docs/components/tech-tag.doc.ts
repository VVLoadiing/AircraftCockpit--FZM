import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-tag/Basic.vue'
import BasicSource from '../examples/tech-tag/Basic.vue?raw'

export default {
  name: 'tech-tag',
  title: 'TechTag 科技标签',
  category: '反馈与标识',
  description: '切角标签，语义色变体，可选关闭按钮。',
  intro: ['支持语义色变体与 closable 关闭按钮。可关闭标签常配合 v-for + splice 实现动态标签编辑。'],
  demos: [{ title: '类型变体 + 可关闭标签', component: Basic, source: BasicSource }],
  props: [
    { name: 'type', type: "'' | 'success' | 'warning' | 'danger' | 'info'", default: "''", desc: '着色（语义色变体）' },
    { name: 'closable', type: 'boolean', default: 'false', desc: '是否可关闭' },
  ],
  slots: [{ name: 'default', desc: '标签内容' }],
  events: [{ name: 'close', params: '-', desc: '点击关闭按钮时触发' }],
} satisfies ComponentDoc
