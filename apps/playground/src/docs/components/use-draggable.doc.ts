import type { ComponentDoc } from '../types'
import Basic from '../examples/use-draggable/Basic.vue'
import BasicSource from '../examples/use-draggable/Basic.vue?raw'

export default {
  name: 'use-draggable',
  title: 'useDraggable 拖动',
  category: '输入与导航',
  description:
    '组合式函数（非组件）：为元素绑定鼠标左键拖动，返回响应式位置。位置只返回 ref，由调用方自行绑定 transform —— 走 GPU 合成层，大屏多元素场景不触发重排。',
  intro: [
    '按住鼠标左键拖动元素；右键保留原生菜单行为。',
    '支持边界约束（bounds）、网格吸附（grid）、拖拽手柄（handle）、响应式禁用（disabled）。',
    '拖拽期的 mousemove/mouseup 绑定到 document，保证鼠标移出元素边界仍能继续跟手。',
  ],
  demos: [{ title: '左键拖动卡片（含边界约束）', component: Basic, source: BasicSource }],
  props: [
    { name: 'initial', type: '{ x: number; y: number }', default: '{ x: 0, y: 0 }', desc: '初始位置偏移' },
    {
      name: 'bounds',
      type: "'parent' | 'window' | Ref<HTMLElement>",
      default: '—',
      desc: '边界约束：不拖出父容器 / 视口 / 指定元素',
    },
    { name: 'grid', type: '[number, number]', default: '—', desc: '网格吸附，如 [8, 8]' },
    { name: 'handle', type: 'Ref<HTMLElement>', default: '—', desc: '拖拽手柄：仅在手柄上按下左键才触发' },
    { name: 'disabled', type: 'Ref<boolean>', default: 'false', desc: '响应式禁用' },
    {
      name: 'onStart',
      type: '(pos) => boolean | void',
      default: '—',
      desc: '拖动开始回调，返回 false 可阻止本次拖动',
    },
    { name: 'onMove', type: '(pos) => void', default: '—', desc: '拖动中回调（每次位置变化）' },
    { name: 'onEnd', type: '(pos) => void', default: '—', desc: '拖动结束回调，常用于持久化位置' },
  ],
} satisfies ComponentDoc
