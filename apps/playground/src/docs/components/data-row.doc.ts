import type { ComponentDoc } from '../types'
import Basic from '../examples/data-row/Basic.vue'
import BasicSource from '../examples/data-row/Basic.vue?raw'

export default {
  name: 'data-row',
  title: 'DataRow 数据行',
  category: '数据展示',
  description: '简洁的数据键值行，hover 变 --bg-hover。',
  intro: ['适合在卡片内展示设备元信息等键值对。值默认使用 mono 字体右对齐，也可通过默认插槽自定义内容。'],
  demos: [{ title: '基础用法 + 自定义值插槽', component: Basic, source: BasicSource }],
  props: [{ name: 'label', type: 'string', default: "''", desc: '键名（也可用 #label 插槽）' }],
  slots: [
    { name: 'label', desc: '键名内容（覆盖 label prop）' },
    { name: 'default', desc: '值内容（默认 mono 字体右对齐）' },
  ],
} satisfies ComponentDoc
