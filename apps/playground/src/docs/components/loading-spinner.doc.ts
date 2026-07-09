import type { ComponentDoc } from '../types'
import Basic from '../examples/loading-spinner/Basic.vue'
import BasicSource from '../examples/loading-spinner/Basic.vue?raw'

export default {
  name: 'loading-spinner',
  title: 'LoadingSpinner 加载中',
  category: '反馈与标识',
  description: '机甲风双环旋转（外环顺时针、内环逆时针）+ 主题色辉光 + 可选文字。',
  intro: ['颜色取主题色，自动随主题联动。配合条件渲染，可在数据加载时用 LoadingSpinner 替代图表/列表内容。'],
  demos: [{ title: '基础用法', component: Basic, source: BasicSource }],
  props: [
    { name: 'size', type: 'number', default: '28', desc: '尺寸（px）' },
    { name: 'text', type: 'string', default: "''", desc: '描述文字（传值后布局变为纵向）' },
  ],
} satisfies ComponentDoc
