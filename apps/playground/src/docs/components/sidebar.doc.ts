import type { ComponentDoc } from '../types'
import Basic from '../examples/sidebar/Basic.vue'
import BasicSource from '../examples/sidebar/Basic.vue?raw'

export default {
  name: 'sidebar',
  title: 'Sidebar 侧栏',
  category: '布局',
  description: '透明浮层侧栏，卡片直接浮于场景之上。',
  intro: ['直接子元素会获得错峰 fadeIn 入场动画（最多 8 个，超出不再错峰但仍有动画）。注意：错峰动画只作用于 Sidebar 的直接子元素，请把卡片作为直接子节点。'],
  demos: [{ title: '基础用法', component: Basic, source: BasicSource }],
  props: [
    { name: 'width', type: "'normal' | 'narrow' | 'wide'", default: "'normal'", desc: '宽度变体' },
    { name: 'customWidth', type: 'string', default: "''", desc: "自定义宽度（覆盖 width 变体，需带单位，如 '360px'）" },
  ],
  slots: [{ name: 'default', desc: '侧栏内容（建议放 TechCard 等卡片）' }],
} satisfies ComponentDoc
