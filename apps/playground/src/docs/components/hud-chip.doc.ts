import type { ComponentDoc } from '../types'
import Basic from '../examples/hud-chip/Basic.vue'
import BasicSource from '../examples/hud-chip/Basic.vue?raw'

export default {
  name: 'hud-chip',
  title: 'HudChip 提示标签',
  category: '反馈与标识',
  description: '小型 HUD 提示标签，小切角 + 半透底。',
  intro: ['比 TechTag 更紧凑的提示标签，常用于状态标记、分类标签等。'],
  demos: [{ title: '语义色变体', component: Basic, source: BasicSource }],
  props: [{ name: 'type', type: "'' | 'success' | 'warning' | 'danger' | 'info'", default: "''", desc: '着色（语义色变体）' }],
  slots: [{ name: 'default', desc: '标签内容' }],
} satisfies ComponentDoc
