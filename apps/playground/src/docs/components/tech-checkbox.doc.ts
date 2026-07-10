import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-checkbox/Basic.vue'
import BasicSource from '../examples/tech-checkbox/Basic.vue?raw'

export default {
  name: 'tech-checkbox',
  title: 'Checkbox / Radio 复选与单选',
  category: '输入与导航',
  description: '科技风复选框、单选框及对应的组容器，主题色选中态 + 辉光。',
  intro: [
    'TechCheckbox 复选框：支持独立 boolean 模式与 Group 数组模式；indeterminate 半选态用于全选场景。',
    'TechCheckboxGroup 复选框组：v-model 绑定数组，通过 options 快速生成或用插槽手写子项，子 Checkbox 自动同步。',
    'TechRadio 单选框 + TechRadioGroup 单选组：v-model 绑定单值，direction 控制横向/纵向排列。',
    '组模式通过 provide/inject 自动同步选中态，无需手动绑定每个子项。',
  ],
  demos: [{ title: '复选框 / 单选框 / 组', component: Basic, source: BasicSource }],
  props: [
    { name: 'TechCheckbox.modelValue', type: 'boolean', default: 'false', desc: '独立模式 v-model 绑定值' },
    { name: 'TechCheckbox.label', type: 'string | number', default: "''", desc: '组模式下该选项的值' },
    { name: 'TechCheckbox.disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
    { name: 'TechCheckbox.indeterminate', type: 'boolean', default: 'false', desc: '半选态（全选场景中间状态，仅视觉）' },
    { name: 'TechCheckboxGroup.modelValue', type: '(string|number)[]', default: '[]', desc: '组模式 v-model 绑定值数组' },
    { name: 'TechCheckboxGroup.options', type: '{ label, text? }[]', default: '[]', desc: '快速生成选项' },
    { name: 'TechRadioGroup.modelValue', type: 'string | number', default: "''", desc: '单选组当前选中值' },
    { name: 'TechRadioGroup.direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: '排列方向' },
  ],
  events: [
    { name: 'change', params: '(val)', desc: '选中变化时触发' },
  ],
} satisfies ComponentDoc
