/**
 * TechCard — 组件文档配置
 * 内容迁移自 apps/docs/components/tech-card.md
 */
import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-card/Basic.vue'
import BasicSource from '../examples/tech-card/Basic.vue?raw'
import Slots from '../examples/tech-card/Slots.vue'
import SlotsSource from '../examples/tech-card/Slots.vue?raw'
import Scroll from '../examples/tech-card/Scroll.vue'
import ScrollSource from '../examples/tech-card/Scroll.vue?raw'

export default {
  name: 'tech-card',
  title: 'TechCard',
  category: '基础容器',
  description: '切角科技面板，整套设计系统最核心的容器。',
  intro: [
    '视觉特征：八边形 clip-path 切角（左上 + 右下各切一刀）+ 顶部扫光横线 + 左切角斜边高亮线 + 左侧纵向发光光柱。',
    '带可选的科技横幅条标题，是构建大屏卡片模块的基础。',
  ],
  demos: [
    { title: '基础用法', component: Basic, source: BasicSource },
    { title: '标题与底部插槽', component: Slots, source: SlotsSource },
    { title: '限制内容区高度（超出滚动）', component: Scroll, source: ScrollSource },
  ],
  props: [
    { name: 'title', type: 'string', default: "''", desc: '卡片标题（科技横幅条）。不传则不渲染标题条' },
    { name: 'hoverable', type: 'boolean', default: 'true', desc: '是否开启悬停辉光（边框增强 + 主题色外辉光）' },
    { name: 'fill', type: 'boolean', default: 'false', desc: '是否在 flex 列里均分高度（flex: 1 1 0）' },
    { name: 'minHeight', type: 'string', default: "''", desc: "内容区最小高度（如 '120px'）。内容不足时撑开到该高度" },
    { name: 'maxHeight', type: 'string', default: "''", desc: "内容区最大高度（如 '300px'）。超出则纵向滚动；'none' 表示不限" },
  ],
  slots: [
    { name: 'title', desc: '标题内容（覆盖 title prop）' },
    { name: 'default', desc: '主体内容区（默认 flex 列向）' },
    { name: 'footer', desc: '底部区域（如操作按钮）' },
  ],
} satisfies ComponentDoc
