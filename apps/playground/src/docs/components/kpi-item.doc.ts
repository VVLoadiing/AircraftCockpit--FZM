import type { ComponentDoc } from '../types'
import Basic from '../examples/kpi-item/Basic.vue'
import BasicSource from '../examples/kpi-item/Basic.vue?raw'

export default {
  name: 'kpi-item',
  title: 'KpiItem KPI 大数字',
  category: '数据展示',
  description: '大屏顶部关键指标展示，等宽数字字体 + 主题色辉光。',
  intro: ['大屏顶部的关键指标展示组件。多个 KpiItem 横向排列时会自动出现分隔竖线，数值统一使用 mono 等宽字体保证对齐。'],
  demos: [{ title: '基础用法', component: Basic, source: BasicSource }],
  props: [
    { name: 'value', type: 'string | number', default: "''", desc: '数值（必填）' },
    { name: 'label', type: 'string', default: "''", desc: '标签（必填）' },
    { name: 'type', type: "'' | 'success' | 'warning' | 'danger' | 'info'", default: "''", desc: '数值着色（语义色变体）' },
    { name: 'unit', type: 'string', default: "''", desc: '数值单位（后缀）' },
  ],
} satisfies ComponentDoc
