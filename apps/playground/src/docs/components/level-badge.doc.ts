import type { ComponentDoc } from '../types'
import Basic from '../examples/count-badge/Basic.vue'
import BasicSource from '../examples/count-badge/Basic.vue?raw'

export default {
  name: 'level-badge',
  title: 'LevelBadge 告警等级',
  category: '反馈与标识',
  description: '告警等级徽章，红/黄/蓝切角小标。',
  intro: ['用于告警、风险等级标识。high 危险红、mid 警告黄、low 主题蓝，默认文字取「高/中/低」。'],
  demos: [{ title: '与 CountBadge 同族展示', component: Basic, source: BasicSource }],
  props: [
    { name: 'level', type: "'high' | 'mid' | 'low'", default: "'low'", desc: '等级：high(红) / mid(黄) / low(蓝)' },
    { name: 'text', type: 'string', default: "''", desc: '文字（默认取等级名「高/中/低」）' },
  ],
  slots: [{ name: 'default', desc: '自定义文字（覆盖 text）' }],
} satisfies ComponentDoc
