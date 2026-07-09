import type { ComponentDoc } from '../types'
import Basic from '../examples/hud-button/Basic.vue'
import BasicSource from '../examples/hud-button/Basic.vue?raw'
import Icon from '../examples/hud-button/Icon.vue'
import IconSource from '../examples/hud-button/Icon.vue?raw'

export default {
  name: 'hud-button',
  title: 'HudButton 按钮',
  category: '反馈与标识',
  description: '切角 HUD 操作按钮，深蓝底 + 内辉光。',
  intro: ['default 为深蓝半透底 + 主题色边框；primary 主题色实底；success/warning/danger 对应语义色边框与 hover 辉光。'],
  demos: [
    { title: '类型变体', component: Basic, source: BasicSource },
    { title: '带图标（#icon 插槽）', component: Icon, source: IconSource },
  ],
  props: [
    { name: 'type', type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'", default: "'default'", desc: '按钮类型' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
    { name: 'nativeType', type: "'button' | 'submit' | 'reset'", default: "'button'", desc: '原生 type 属性' },
  ],
  slots: [
    { name: 'icon', desc: '图标（前置）' },
    { name: 'default', desc: '按钮文字' },
  ],
} satisfies ComponentDoc
