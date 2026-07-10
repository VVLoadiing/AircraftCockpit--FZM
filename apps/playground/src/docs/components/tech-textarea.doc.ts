import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-textarea/Basic.vue'
import BasicSource from '../examples/tech-textarea/Basic.vue?raw'

export default {
  name: 'tech-textarea',
  title: 'TechTextarea 多行输入',
  category: '输入与导航',
  description: '科技风多行文本框，与 TechInput 同风格，支持字数统计与限制。',
  intro: ['切角 + 主题色聚焦辉光 + 微透底，与 TechInput 视觉统一。支持 rows 行数、maxlength 字数限制、showCount 字数统计。'],
  demos: [{ title: '基础用法 + 字数统计', component: Basic, source: BasicSource }],
  props: [
    { name: 'modelValue', type: 'string', default: "''", desc: 'v-model 绑定值' },
    { name: 'placeholder', type: 'string', default: "''", desc: '占位符' },
    { name: 'rows', type: 'number', default: '4', desc: '行数' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
    { name: 'readonly', type: 'boolean', default: 'false', desc: '只读' },
    { name: 'maxlength', type: 'number', default: '-', desc: '最大字数' },
    { name: 'showCount', type: 'boolean', default: 'false', desc: '是否显示字数统计' },
    { name: 'resizable', type: 'boolean', default: 'false', desc: '是否可调整大小' },
  ],
  events: [
    { name: 'update:modelValue', params: '(value: string)', desc: 'v-model 同步' },
    { name: 'change', params: '(value: string)', desc: '失焦时触发' },
  ],
} satisfies ComponentDoc
