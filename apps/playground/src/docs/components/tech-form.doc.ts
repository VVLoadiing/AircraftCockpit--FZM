import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-form/Basic.vue'
import BasicSource from '../examples/tech-form/Basic.vue?raw'

export default {
  name: 'tech-form',
  title: 'Form 表单',
  category: '输入与导航',
  description: '表单容器 + 表单项，统一布局 + 内置轻量 rules 校验。',
  intro: [
    'TechForm 表单容器：通过 model（数据对象）+ rules（校验规则）配置，provide 给子 FormItem；暴露 validate()（返回 Promise<boolean>）、resetFields()、clearErrors() 方法。',
    'TechFormItem 表单项：label 标签 + 控件插槽 + 错误提示；依据 prop 自动查 rules 校验，blur/change 时自动校验，校验失败显示红色提示。',
    '内置规则类型：required（必填）/ min&max（字符串长度或数值范围）/ pattern（正则）/ validator（自定义，可异步）。',
    '校验时机：trigger 为 blur 时失焦校验、change 时变化校验；不传 trigger 默认 blur。Form.validate() 统一校验全部。',
  ],
  demos: [{ title: '综合示例（校验 + 提交 + 重置）', component: Basic, source: BasicSource }],
  props: [
    { name: 'TechForm.model', type: 'Record<string, unknown>', default: '{}', desc: '表单数据对象（与 FormItem.prop 对应）' },
    { name: 'TechForm.rules', type: 'FormRules', default: '{}', desc: '校验规则映射（字段名 → 规则数组）' },
    { name: 'TechForm.labelWidth', type: 'string', default: "'90px'", desc: '标签宽度' },
    { name: 'TechForm.labelPosition', type: "'left' | 'top' | 'right'", default: "'left'", desc: '标签位置' },
    { name: 'TechFormItem.label', type: 'string', default: "''", desc: '标签文字' },
    { name: 'TechFormItem.prop', type: 'string', default: "''", desc: '对应 model 的字段名（必填，用于查 rules 与取值）' },
    { name: 'TechFormItem.required', type: 'boolean', default: 'false', desc: '是否必填（视觉红星；不传则自动依据 rules）' },
  ],
  slots: [
    { name: 'TechForm.default', desc: '表单内容（放 FormItem）' },
    { name: 'TechFormItem.default', desc: '控件（Input/Select 等）' },
  ],
  events: [
    { name: 'TechForm.validate()', params: 'Promise<boolean>', desc: '整体校验，返回是否全部通过' },
    { name: 'TechForm.resetFields()', params: '-', desc: '重置全部 FormItem 到初始值' },
  ],
} satisfies ComponentDoc
