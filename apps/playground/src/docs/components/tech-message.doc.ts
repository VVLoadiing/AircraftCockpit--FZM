import type { ComponentDoc } from '../types'
import Basic from '../examples/tech-message/Basic.vue'
import BasicSource from '../examples/tech-message/Basic.vue?raw'

export default {
  name: 'tech-message',
  title: 'Message 消息提示',
  category: '反馈与标识',
  description: '轻量全局消息提示，命令式调用，顶部出现、定时自动消失。',
  intro: [
    '命令式 API：Message.success(text) 一行调用，自动出现在页面顶部并定时消失，无需手动管理 v-model。',
    '支持四种类型（success / info / warning / danger），可自定义显示时长，支持 closeAll 关闭全部。',
    '内部维护单例容器（首次调用时挂载到 body），消息队列带滑入/滑出过渡，点击消息可提前关闭。',
    '也可用 useMessage() 组合式函数在 setup 内调用，返回相同的方法集。',
  ],
  demos: [{ title: '基础用法（四种类型）', component: Basic, source: BasicSource }],
  // Message 是命令式 API（非声明式组件），无传统 props/slots，用法以方法签名形式说明
  props: [
    { name: 'Message.success(text, duration?)', type: 'function', default: '-', desc: '成功消息（翠绿图标）' },
    { name: 'Message.info(text, duration?)', type: 'function', default: '-', desc: '信息消息（主题色图标）' },
    { name: 'Message.warning(text, duration?)', type: 'function', default: '-', desc: '警告消息（黄色图标）' },
    { name: 'Message.danger(text, duration?)', type: 'function', default: '-', desc: '错误消息（红色图标）' },
    { name: 'Message.open(options)', type: 'function', default: '-', desc: '完整配置：{ type, text, duration }，返回 close 函数' },
    { name: 'Message.closeAll()', type: 'function', default: '-', desc: '关闭全部消息' },
    { name: 'duration', type: 'number', default: '2400', desc: '显示时长（ms），传 0 表示不自动关闭' },
  ],
} satisfies ComponentDoc
