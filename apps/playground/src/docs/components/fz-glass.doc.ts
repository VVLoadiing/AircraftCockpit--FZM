import type { ComponentDoc } from '../types'
import Basic from '../examples/fz-glass/Basic.vue'
import BasicSource from '../examples/fz-glass/Basic.vue?raw'
import Strong from '../examples/fz-glass/Strong.vue'
import StrongSource from '../examples/fz-glass/Strong.vue?raw'

export default {
  name: 'fz-glass',
  title: 'FzGlass 玻璃浮窗',
  category: '基础容器',
  description: '全局统一的黑色玻璃浮窗基类，弹窗 / 详情卡 / 配置面板的统一外观。',
  intro: [
    '视觉特征：深黑透明 + 28px 强模糊 + 青色辉光 + 顶部 1px 扫光高光 + 右上角微小角光（机甲仪表感）。',
    '配套三个子组件：FzGlassTitle（左色条 + 发光文字标题）、FzGlassRow（键值数据行）、FzGlassClose（关闭按钮）。',
  ],
  demos: [
    { title: '浮窗容器 + 子组件', component: Basic, source: BasicSource },
    { title: '加强不透明底', component: Strong, source: StrongSource },
  ],
  props: [
    { name: 'strong', type: 'boolean', default: 'false', desc: '是否使用更强不透明的玻璃底' },
    { name: 'tag', type: 'string', default: "'div'", desc: '自定义渲染标签' },
  ],
  slots: [{ name: 'default', desc: '浮窗内容' }],
  events: [{ name: 'close', params: '-', desc: 'FzGlassClose 点击关闭时触发' }],
} satisfies ComponentDoc
