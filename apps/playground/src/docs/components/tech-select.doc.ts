import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-select/Basic.vue'
import BasicSource from '../examples/tech-select/Basic.vue?raw'
import Slots from '../examples/tech-select/Slots.vue'
import SlotsSource from '../examples/tech-select/Slots.vue?raw'

export default {
  name: 'tech-select',
  title: 'TechSelect 下拉选择',
  category: '输入与导航',
  description: '切角触发器 + 机甲风玻璃浮层选项列表，支持禁用项、键盘 ESC 关闭、选中滚动定位。',
  intro: ['options 的每个对象除必填的 label / value 外，可携带任意额外字段（如 color、desc、icon），通过 #option / #trigger 插槽的 option 参数读取，便于自定义渲染。'],
  demos: [
    { title: '基础用法', component: Basic, source: BasicSource },
    { title: '自定义选项/触发器（插槽）', component: Slots, source: SlotsSource },
  ],
  props: [
    { name: 'modelValue', type: 'string | number', default: "''", desc: 'v-model 绑定值' },
    { name: 'options', type: '{ label, value, disabled?, ...extra }[]', default: "''", desc: '选项列表（必填）。支持携带任意额外字段供插槽读取' },
    { name: 'placeholder', type: 'string', default: "'请选择'", desc: '占位符' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用整个选择器' },
  ],
  slots: [
    { name: 'trigger', desc: '自定义触发器显示（作用域参数 { option, label }）' },
    { name: 'option', desc: '自定义选项内容（作用域参数 { option }）' },
  ],
  events: [
    { name: 'update:modelValue', params: '(value)', desc: 'v-model 同步' },
    { name: 'change', params: '(value, option)', desc: '选择某项时触发' },
  ],
} satisfies ComponentDoc
