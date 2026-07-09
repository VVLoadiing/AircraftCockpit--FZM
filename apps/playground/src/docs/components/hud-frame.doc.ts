import type { ComponentDoc } from '../types'
import Basic from '../examples/hud-frame/Basic.vue'
import BasicSource from '../examples/hud-frame/Basic.vue?raw'

export default {
  name: 'hud-frame',
  title: 'HudFrame HUD 边框',
  category: '布局',
  description: '全屏 HUD 机甲边框（App 级外框）。',
  intro: ['大屏四缘的八边形切角边框 + 上下中央扫光线 + 四角发光角标。通常放在 App 根节点最外层，position: fixed 全屏覆盖、pointer-events: none 不影响交互。'],
  demos: [{ title: '基础用法', component: Basic, source: BasicSource }],
  props: [
    { name: 'corners', type: 'boolean', default: 'true', desc: '是否显示四角发光角标' },
    { name: 'scanlines', type: 'boolean', default: 'true', desc: '是否显示上下扫光线' },
  ],
} satisfies ComponentDoc
