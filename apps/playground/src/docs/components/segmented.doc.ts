import type { ComponentDoc } from '../types'
import Basic from '../examples/segmented/Basic.vue'
import BasicSource from '../examples/segmented/Basic.vue?raw'

export default {
  name: 'segmented',
  title: 'Segmented 分段控制器',
  category: '输入与导航',
  description: '凹槽容器 + 激活段主题色凸起 + 辉光。少量互斥选项的紧凑切换（机甲风 radio 组）。',
  intro: ['设置 block 后各段等分撑满父容器宽度，适合需要占据整行的场景。'],
  demos: [{ title: '基础用法 + 撑满', component: Basic, source: BasicSource }],
  props: [
    { name: 'modelValue', type: 'string | number', default: "''", desc: 'v-model：当前激活值' },
    { name: 'items', type: '{ value, label, disabled? }[]', default: "''", desc: '选项（必填）' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用整组' },
    { name: 'block', type: 'boolean', default: 'false', desc: '是否撑满父容器宽度（各段等分）' },
  ],
  events: [
    { name: 'update:modelValue', params: '(value)', desc: 'v-model 同步' },
    { name: 'change', params: '(value, item)', desc: '切换时触发' },
  ],
} satisfies ComponentDoc
