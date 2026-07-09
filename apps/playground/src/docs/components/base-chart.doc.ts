import type { ComponentDoc } from '../types'
import Basic from '../examples/base-chart/Basic.vue'
import BasicSource from '../examples/base-chart/Basic.vue?raw'

export default {
  name: 'base-chart',
  title: 'BaseChart 图表封装',
  category: '数据展示',
  description: 'ECharts 自适应封装，配合主题色板实现图表配色联动。',
  intro: [
    '封装了 init / setOption / ResizeObserver / dispose，配合 .fzm-chart-fill 工具类实现容器自适应。',
    'echarts 是 @fzm/ui 的可选 peerDependency，使用前需自行安装（pnpm add echarts）。组件内部用动态 import 引入。',
    '配色规范：图表 option 中所有颜色都应来自 palette.value，不要写死颜色，否则切换主题时图表配色不变。',
  ],
  demos: [{ title: '三种基础图表（折线/柱状/饼）', component: Basic, source: BasicSource }],
  props: [
    { name: 'option', type: 'EChartsOption', default: "''", desc: 'ECharts 配置（必填）' },
    { name: 'width', type: 'string', default: "'100%'", desc: '宽度' },
    { name: 'height', type: 'string', default: "'200px'", desc: '高度' },
    { name: 'notMerge', type: 'boolean', default: 'true', desc: 'option 变化时是否整体替换（notMerge）' },
  ],
} satisfies ComponentDoc
