import type { ComponentDoc } from '../types'
import Basic from '../examples/icon-toggle/Basic.vue'
import BasicSource from '../examples/icon-toggle/Basic.vue?raw'

export default {
  name: 'icon-toggle',
  title: 'IconToggle 图标按钮组',
  category: '输入与导航',
  description: '一组图标/文字按钮，单选模式，激活项主题色凸起 + 辉光。适合视图模式切换、工具栏。',
  intro: ['icon 是 SVG <path d="..."> 字符串，组件用 v-html 注入到 <path> 中。label 可选，与图标共存（图标在左、文字在右）。纯文字按钮可不传 icon。'],
  demos: [{ title: '基础用法', component: Basic, source: BasicSource }],
  props: [
    { name: 'modelValue', type: 'string | number', default: "''", desc: 'v-model：当前激活项 value' },
    { name: 'items', type: '{ value, label?, icon?, disabled? }[]', default: "''", desc: '选项列表（必填）' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用整组' },
  ],
  events: [
    { name: 'update:modelValue', params: '(value)', desc: 'v-model 同步' },
    { name: 'change', params: '(value, item)', desc: '切换时触发' },
  ],
} satisfies ComponentDoc
