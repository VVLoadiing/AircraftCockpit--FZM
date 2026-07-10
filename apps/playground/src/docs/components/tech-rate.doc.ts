import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-rate/Basic.vue'
import BasicSource from '../examples/tech-rate/Basic.vue?raw'

export default {
  name: 'tech-rate',
  title: 'TechRate 评分',
  category: '输入与导航',
  description: '科技风评分组件，SVG 星标 + 主题色辉光，支持半星与键盘。',
  intro: ['点击星标评分，主题色填充 + 辉光。支持半星（allowHalf）、只读、键盘左右/上下调节（无障碍）。'],
  demos: [{ title: '基础用法（整星/半星/只读）', component: Basic, source: BasicSource }],
  props: [
    { name: 'modelValue', type: 'number', default: '0', desc: 'v-model 绑定值（当前评分）' },
    { name: 'max', type: 'number', default: '5', desc: '最大星数' },
    { name: 'allowHalf', type: 'boolean', default: 'false', desc: '是否允许半星' },
    { name: 'readonly', type: 'boolean', default: 'false', desc: '只读（不可点击）' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
  ],
  events: [
    { name: 'update:modelValue', params: '(val: number)', desc: 'v-model 同步' },
    { name: 'change', params: '(val: number)', desc: '评分变化时触发' },
  ],
} satisfies ComponentDoc
