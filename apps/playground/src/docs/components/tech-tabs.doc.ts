import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-tabs/Basic.vue'
import BasicSource from '../examples/tech-tabs/Basic.vue?raw'

export default {
  name: 'tech-tabs',
  title: 'TechTabs 标签页',
  category: '输入与导航',
  description: '科技横幅条风格标签头 + 激活指示条（主题色光柱 + 辉光）。配合面板插槽渲染内容。',
  intro: ['默认插槽提供作用域参数 { item, value }，方便条件渲染。也可用 #panel-{value} 具名插槽按标签分发不同面板。'],
  demos: [{ title: '基础用法', component: Basic, source: BasicSource }],
  props: [
    { name: 'modelValue', type: 'string | number', default: "''", desc: 'v-model：当前激活标签 value' },
    { name: 'items', type: '{ value, label, disabled? }[]', default: "''", desc: '标签列表（必填）' },
  ],
  slots: [
    { name: 'default', desc: '面板内容（作用域插槽，提供 { item, value }）' },
    { name: 'panel-{value}', desc: '按标签 value 命名的面板（如 #panel-overview）' },
  ],
  events: [
    { name: 'update:modelValue', params: '(value)', desc: 'v-model 同步' },
    { name: 'change', params: '(value, item)', desc: '切换标签时触发' },
  ],
} satisfies ComponentDoc
