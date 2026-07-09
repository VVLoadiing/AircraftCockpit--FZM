import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-dialog/Basic.vue'
import BasicSource from '../examples/tech-dialog/Basic.vue?raw'
import Form from '../examples/tech-dialog/Form.vue'
import FormSource from '../examples/tech-dialog/Form.vue?raw'
import Async from '../examples/tech-dialog/Async.vue'
import AsyncSource from '../examples/tech-dialog/Async.vue?raw'

export default {
  name: 'tech-dialog',
  title: 'TechDialog 对话框',
  category: '反馈与标识',
  description: '科技风模态对话框，玻璃浮窗视觉 + 遮罩 + ESC/点遮罩关闭 + 确认取消 + 过渡动画。',
  intro: [
    '基于 FzGlass 的黑色玻璃浮窗视觉（深黑透明 + 强模糊 + 青色辉光 + 顶部扫光），叠加遮罩层。',
    '用 v-model:visible 双向绑定控制显隐；支持 ESC 键关闭、点击遮罩关闭、内置确认/取消按钮区、进出缩放过渡动画。',
    '打开时自动锁定 body 滚动并注册 ESC 监听，关闭/卸载时自动清理，无副作用。',
  ],
  demos: [
    { title: '基础用法（确认/取消）', component: Basic, source: BasicSource },
    { title: '自定义内容（表单）', component: Form, source: FormSource },
    { title: '异步确认（confirmLoading）', component: Async, source: AsyncSource },
  ],
  props: [
    { name: 'visible', type: 'boolean', default: 'false', desc: '是否显示（v-model:visible）' },
    { name: 'title', type: 'string', default: "''", desc: '标题' },
    { name: 'width', type: 'string', default: "'440px'", desc: "宽度（如 '420px'、'80%'）" },
    { name: 'closable', type: 'boolean', default: 'true', desc: '是否显示关闭按钮（右上角）' },
    { name: 'closeOnOverlay', type: 'boolean', default: 'true', desc: '是否点击遮罩层关闭' },
    { name: 'closeOnEsc', type: 'boolean', default: 'true', desc: '是否按 ESC 关闭' },
    { name: 'showFooter', type: 'boolean', default: 'false', desc: '是否显示底部确认/取消按钮区' },
    { name: 'confirmText', type: 'string', default: "'确认'", desc: '确认按钮文字' },
    { name: 'cancelText', type: 'string', default: "'取消'", desc: '取消按钮文字' },
    { name: 'confirmLoading', type: 'boolean', default: 'false', desc: '确认按钮加载中（异步提交时防重复点击）' },
    { name: 'confirmDisabled', type: 'boolean', default: 'false', desc: '是否禁用确认按钮' },
    { name: 'footerAlign', type: "'left' | 'center' | 'right'", default: "'right'", desc: '底部按钮对齐方式' },
  ],
  slots: [
    { name: 'header', desc: '自定义标题区（覆盖 title prop）' },
    { name: 'default', desc: '内容区' },
    { name: 'footer', desc: '自定义底部区（覆盖内置确认/取消按钮）' },
  ],
  events: [
    { name: 'update:visible', params: '(val: boolean)', desc: 'v-model:visible 更新' },
    { name: 'confirm', params: '-', desc: '点击确认按钮' },
    { name: 'cancel', params: '-', desc: '点击取消按钮（会触发关闭）' },
    { name: 'close', params: '-', desc: '关闭（任意方式关闭均触发：遮罩/ESC/关闭按钮/取消按钮）' },
  ],
} satisfies ComponentDoc
