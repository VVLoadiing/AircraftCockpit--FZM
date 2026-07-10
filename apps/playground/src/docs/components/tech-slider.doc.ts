import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-slider/Basic.vue'
import BasicSource from '../examples/tech-slider/Basic.vue?raw'

export default {
  name: 'tech-slider',
  title: 'TechSlider 滑块',
  category: '输入与导航',
  description: '科技风滑块，主题色渐变轨道 + 辉光滑块。',
  intro: ['基于原生 input[type=range] 封装，已选部分主题色渐变填充，滑块带辉光。支持 min/max/step、数值显示、禁用。'],
  demos: [{ title: '基础用法', component: Basic, source: BasicSource }],
  props: [
    { name: 'modelValue', type: 'number', default: '0', desc: 'v-model 绑定值' },
    { name: 'min', type: 'number', default: '0', desc: '最小值' },
    { name: 'max', type: 'number', default: '100', desc: '最大值' },
    { name: 'step', type: 'number', default: '1', desc: '步长' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
    { name: 'showValue', type: 'boolean', default: 'false', desc: '是否显示当前数值' },
  ],
  events: [
    { name: 'update:modelValue', params: '(val: number)', desc: 'v-model 同步' },
    { name: 'change', params: '(val: number)', desc: '松开时触发' },
  ],
} satisfies ComponentDoc
