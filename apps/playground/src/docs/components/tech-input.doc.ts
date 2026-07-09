import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-input/Basic.vue'
import BasicSource from '../examples/tech-input/Basic.vue?raw'

export default {
  name: 'tech-input',
  title: 'TechInput 输入框',
  category: '输入与导航',
  description: '切角科技风输入框，聚焦时主题色辉光，支持前缀/后缀插槽与清空。',
  intro: ['支持 v-model 双向绑定、clearable 一键清空、prefix/suffix 插槽承载图标或单位。'],
  demos: [{ title: '基础用法 + 前后缀插槽', component: Basic, source: BasicSource }],
  props: [
    { name: 'modelValue', type: 'string | number', default: "''", desc: 'v-model 绑定值' },
    { name: 'placeholder', type: 'string', default: "''", desc: '占位符' },
    { name: 'type', type: 'string', default: "'text'", desc: '原生 input type' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
    { name: 'readonly', type: 'boolean', default: 'false', desc: '只读' },
    { name: 'clearable', type: 'boolean', default: 'false', desc: '是否可清空' },
  ],
  slots: [
    { name: 'prefix', desc: '前置内容（图标、单位）' },
    { name: 'suffix', desc: '后置内容' },
  ],
  events: [
    { name: 'update:modelValue', params: '(value: string)', desc: 'v-model 同步' },
    { name: 'change', params: '(value: string)', desc: '失焦/回车时触发' },
    { name: 'clear', params: '-', desc: '点击清空按钮时触发' },
  ],
} satisfies ComponentDoc
