import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-row/Basic.vue'
import BasicSource from '../examples/tech-row/Basic.vue?raw'

export default {
  name: 'tech-row',
  title: 'TechRow 科技列表项',
  category: '数据展示',
  description: '科技风列表项，左 2px 强调边 + hover/active 加深底。',
  intro: ['适合告警列表、设备清单、消息流等场景。提供 prefix / suffix 插槽承载徽章、时间等附加内容。'],
  demos: [{ title: '告警列表（前后缀插槽）', component: Basic, source: BasicSource }],
  props: [{ name: 'active', type: 'boolean', default: 'false', desc: '是否激活态' }],
  slots: [
    { name: 'prefix', desc: '左侧前置内容（如徽章、图标）' },
    { name: 'default', desc: '主体内容（flex 撑满）' },
    { name: 'suffix', desc: '右侧后置内容（如时间）' },
  ],
} satisfies ComponentDoc
