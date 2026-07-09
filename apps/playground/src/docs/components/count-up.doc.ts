import type { ComponentDoc } from '../types'
import Basic from '../examples/count-up/Basic.vue'
import BasicSource from '../examples/count-up/Basic.vue?raw'

export default {
  name: 'count-up',
  title: 'CountUp 数字滚动',
  category: '数据展示',
  description: 'KPI 数值从当前值平滑过渡到目标值（requestAnimationFrame + easeOutQuart）。',
  intro: [
    'mono 字体 + 主题色辉光。value 变化时自动从当前显示值滚动到新值。',
    '与 KpiItem 的区别：KpiItem 是带标签的静态 KPI 卡片；CountUp 是纯数字滚动组件（无标签），适合需要动画过渡的场景，可自由组合进任意布局。',
  ],
  demos: [{ title: '基础用法 + 小数/千分位', component: Basic, source: BasicSource }],
  props: [
    { name: 'value', type: 'number', default: "''", desc: '目标数值（必填）' },
    { name: 'startValue', type: 'number', default: '0', desc: '首次起始值' },
    { name: 'duration', type: 'number', default: '1200', desc: '动画时长（ms）' },
    { name: 'decimals', type: 'number', default: '0', desc: '小数位数' },
    { name: 'thousand', type: 'boolean', default: 'true', desc: '是否千分位分隔' },
    { name: 'prefix', type: 'string', default: "''", desc: '前缀' },
    { name: 'suffix', type: 'string', default: "''", desc: '后缀/单位' },
    { name: 'type', type: "'' | 'success' | 'warning' | 'danger' | 'info'", default: "''", desc: '着色' },
    { name: 'fontSize', type: 'string', default: "'22px'", desc: '字号' },
  ],
} satisfies ComponentDoc
