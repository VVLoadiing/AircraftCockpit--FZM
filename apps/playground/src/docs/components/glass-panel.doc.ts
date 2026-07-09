import type { ComponentDoc } from '../types'
import Basic from '../examples/glass-panel/Basic.vue'
import BasicSource from '../examples/glass-panel/Basic.vue?raw'

export default {
  name: 'glass-panel',
  title: 'GlassPanel 玻璃浮层',
  category: '基础容器',
  description: '八边形切角玻璃浮层，用于 3D 场景之上的叠加浮层（如顶部 KPI 带）。',
  intro: [
    '视觉特征：四角八边形 clip-path 切角 + 16px 背景模糊（毛玻璃）+ 顶部扫光高光线。',
    '自身不带内边距，按需通过 style/class 调整 padding，常作为顶部 KPI 浮条、场景叠加层。',
  ],
  demos: [{ title: '基础用法', component: Basic, source: BasicSource }],
  props: [{ name: 'tag', type: 'string', default: "'div'", desc: '自定义渲染的 HTML 标签' }],
  slots: [{ name: 'default', desc: '浮层内容' }],
} satisfies ComponentDoc
