import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-switch/Basic.vue'
import BasicSource from '../examples/tech-switch/Basic.vue?raw'

export default {
  name: 'tech-switch',
  title: 'TechSwitch 开关',
  category: '输入与导航',
  description: '切角轨道 + 滑块，开启时主题色渐变 + 辉光。',
  intro: ['支持 v-model 双向绑定，normal / small 两种尺寸。'],
  demos: [{ title: '基础用法 + 尺寸', component: Basic, source: BasicSource }],
  props: [
    { name: 'modelValue', type: 'boolean', default: 'false', desc: 'v-model 绑定值' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
    { name: 'size', type: "'normal' | 'small'", default: "'normal'", desc: '尺寸' },
  ],
  events: [
    { name: 'update:modelValue', params: '(value: boolean)', desc: 'v-model 同步' },
    { name: 'change', params: '(value: boolean)', desc: '切换时触发' },
  ],
} satisfies ComponentDoc
