import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-divider/Basic.vue'
import BasicSource from '../examples/tech-divider/Basic.vue?raw'

export default {
  name: 'tech-divider',
  title: 'TechDivider 分割线',
  category: '反馈与标识',
  description: '主题色渐变线 + 可选文字/标签（水平居中显示），也可作垂直分隔。',
  intro: ['水平方向可携带文字并控制对齐；垂直方向用于行内分隔。'],
  demos: [{ title: '水平/垂直 + 文字对齐', component: Basic, source: BasicSource }],
  props: [
    { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: '方向' },
    { name: 'align', type: "'left' | 'center' | 'right'", default: "'center'", desc: '文字对齐（水平时生效）' },
  ],
  slots: [{ name: 'default', desc: '分割线文字/标签（仅水平方向）' }],
} satisfies ComponentDoc
