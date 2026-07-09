import type { ComponentDoc } from '../types'
import Basic from '../examples/metric-box/Basic.vue'
import BasicSource from '../examples/metric-box/Basic.vue?raw'

export default {
  name: 'metric-box',
  title: 'MetricBox 统计方块',
  category: '数据展示',
  description: '小型统计方块，适合在卡片内做网格化的指标展示。',
  intro: ['视觉特征：切角 + 顶部 2px 扫光线 + hover 主题色辉光。适合在卡片内网格化展示多个指标。'],
  demos: [{ title: '基础用法', component: Basic, source: BasicSource }],
  props: [
    { name: 'value', type: 'string | number', default: "''", desc: '数值（必填）' },
    { name: 'label', type: 'string', default: "''", desc: '标签（必填）' },
    { name: 'unit', type: 'string', default: "''", desc: '单位（后缀）' },
    { name: 'type', type: "'' | 'success' | 'warning' | 'danger' | 'info'", default: "''", desc: '着色（语义色变体）' },
  ],
} satisfies ComponentDoc
