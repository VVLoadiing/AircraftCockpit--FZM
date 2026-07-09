import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-empty/Basic.vue'
import BasicSource from '../examples/tech-empty/Basic.vue?raw'

export default {
  name: 'tech-empty',
  title: 'TechEmpty 空状态',
  category: '反馈与标识',
  description: '机甲风六边形图标（漂浮动画）+ 描述文字 + 可选操作插槽。列表/图表无数据时占位。',
  intro: ['内置四种图标样式：default（空盒子）、search（无结果）、network（网络异常）、lock（无权限）。可通过默认插槽放操作按钮。'],
  demos: [{ title: '基础用法 + 不同图标', component: Basic, source: BasicSource }],
  props: [
    { name: 'description', type: 'string', default: "'暂无数据'", desc: '描述文字' },
    { name: 'icon', type: "'default' | 'search' | 'network' | 'lock'", default: "'default'", desc: '图标样式' },
  ],
  slots: [{ name: 'default', desc: '操作区（如刷新按钮）' }],
} satisfies ComponentDoc
