import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-scroll/Basic.vue'
import BasicSource from '../examples/tech-scroll/Basic.vue?raw'
import AutoScroll from '../examples/tech-scroll/AutoScroll.vue'
import AutoScrollSource from '../examples/tech-scroll/AutoScroll.vue?raw'
import LoadMore from '../examples/tech-scroll/LoadMore.vue'
import LoadMoreSource from '../examples/tech-scroll/LoadMore.vue?raw'

export default {
  name: 'tech-scroll',
  title: 'TechScroll 滚动容器',
  category: '数据展示',
  description: '科技风滚动容器，自定义简洁滚动条 + 滚动加载 + 无缝循环自动滚动。',
  intro: [
    '三大能力各自独立开关，可组合使用：',
    '1. 自定义滚动条：scrollbar 控制 always（常驻）/ hover（悬停显示，默认）/ none（隐藏），比全局滚动条更细更简洁。',
    "2. 滚动加载：loadMore=true 时，滚到底部阈值 emit('load-more')，父组件请求并追加数据；loading prop 控制加载态，加载中不重复触发。",
    '3. 无缝循环自动滚动：autoScroll=true 时内容双份衔接、匀速上移，到边界无缝重置，适合大屏公告、状态流；pauseOnHover 控制悬停暂停。',
    '自动滚动为展示型，load-more 为交互型，二者一般不同时开启。',
  ],
  demos: [
    { title: '自定义滚动条（hover / always）', component: Basic, source: BasicSource },
    { title: '无缝循环自动滚动', component: AutoScroll, source: AutoScrollSource },
    { title: '滚动加载（load-more）', component: LoadMore, source: LoadMoreSource },
  ],
  props: [
    { name: 'height', type: 'string', default: "'200px'", desc: "容器高度（如 '200px'、'100%'）" },
    { name: 'autoScroll', type: 'boolean', default: 'false', desc: '是否开启无缝循环匀速自动滚动' },
    { name: 'speed', type: 'number', default: '40', desc: '自动滚动速度（px/秒）' },
    { name: 'pauseOnHover', type: 'boolean', default: 'true', desc: '自动滚动时鼠标悬停是否暂停' },
    { name: 'loadMore', type: 'boolean', default: 'false', desc: '是否开启滚动到底部加载（emit load-more）' },
    { name: 'loading', type: 'boolean', default: 'false', desc: '父组件加载中状态（true 时底部显示 loading 且不重复触发）' },
    { name: 'loadDistance', type: 'number', default: '40', desc: '触发 load-more 的距离阈值（px，距底部多近时触发）' },
    { name: 'scrollbar', type: "'always' | 'hover' | 'none'", default: "'hover'", desc: '自定义滚动条显隐模式' },
  ],
  slots: [
    { name: 'default', desc: '滚动内容' },
    { name: 'loading', desc: '自定义加载提示（默认用 LoadingSpinner）' },
  ],
  events: [
    { name: 'load-more', params: '-', desc: '滚动到底部阈值时触发（需 loadMore=true）' },
    { name: 'scroll', params: '{ scrollTop, progress }', desc: '滚动时触发，progress 为 0~1 进度' },
  ],
} satisfies ComponentDoc
