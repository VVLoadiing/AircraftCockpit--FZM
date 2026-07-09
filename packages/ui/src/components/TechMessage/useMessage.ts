/**
 * useMessage — 消息提示的命令式 API
 *
 * 用法：
 *   import { Message } from '@fzm-tech-hud/ui'
 *   Message.success('保存成功')
 *   Message.warning('库存不足')
 *   Message.danger('删除失败')
 *   Message.info('新版本已发布')
 *
 * 原理：
 *  - 模块内维护一个响应式消息队列 + 单例容器（首次调用时 createApp 挂载到 body）
 *  - 容器用 Teleport 渲染到 body 顶部、TransitionGroup 渲染队列，每条带滑入/滑出过渡
 *  - 每条消息 duration 后自动出列移除；open() 返回 close 函数可提前关闭
 *  - 同时导出 useMessage() 组合式函数，返回 { open, success, info, warning, danger, closeAll }
 */
import { createApp, ref, h, Teleport, TransitionGroup, type Component } from 'vue'
import TechMessage from './TechMessage.vue'

/** 单条消息配置 */
export interface MessageOptions {
  /** 类型 */
  type?: 'info' | 'success' | 'warning' | 'danger'
  /** 文字内容 */
  text: string
  /** 显示时长（ms），0 表示不自动关闭 */
  duration?: number
}

interface MessageItem extends Required<Omit<MessageOptions, 'text'>> {
  id: number
  text: string
  /** 自动关闭定时器 */
  timer?: ReturnType<typeof setTimeout>
}

/** 全局消息队列（响应式） */
const messages = ref<MessageItem[]>([])
/** 自增 id */
let seed = 0
/** 单例容器是否已挂载 */
let mounted = false

/** 移除指定消息 */
function remove(id: number) {
  const idx = messages.value.findIndex((m) => m.id === id)
  if (idx === -1) return
  const item = messages.value[idx]
  if (item.timer) clearTimeout(item.timer)
  messages.value.splice(idx, 1)
}

/** 关闭全部 */
function closeAll() {
  messages.value.forEach((m) => m.timer && clearTimeout(m.timer))
  messages.value = []
}

/** 打开一条消息，返回关闭函数 */
function open(options: MessageOptions): () => void {
  ensureMounted()
  const id = seed++
  const duration = options.duration ?? 2400
  const item: MessageItem = {
    id,
    text: options.text,
    type: options.type ?? 'info',
    duration,
  }
  if (duration > 0) {
    item.timer = setTimeout(() => remove(id), duration)
  }
  messages.value.push(item)
  return () => remove(id)
}

/**
 * 确保单例容器已挂载到 body。
 * 容器：固定顶部居中，TransitionGroup 渲染消息队列，每条带过渡，点击可关闭。
 */
function ensureMounted() {
  if (mounted) return
  mounted = true

  const Container: Component = {
    setup() {
      // Teleport / TransitionGroup 为 Vue 内置组件，已从 vue 导入，可直接在 h() 中引用
      return () =>
        h(Teleport, { to: 'body' }, [
          h('div', { class: 'fzm-message-wrap' }, [
            h(
              TransitionGroup,
              { name: 'fzm-message', tag: 'div', class: 'fzm-message-list' },
              () =>
                messages.value.map((m) =>
                  h(TechMessage, {
                    key: m.id,
                    type: m.type,
                    text: m.text,
                    onClick: () => remove(m.id),
                  }),
                ),
            ),
          ]),
        ])
    },
  }

  const app = createApp(Container)
  const host = document.createElement('div')
  document.body.appendChild(host)
  app.mount(host)
}

/* —— 组合式函数（setup 内使用） —— */
export function useMessage() {
  return {
    open,
    success: (text: string, duration?: number) => open({ type: 'success', text, duration }),
    info: (text: string, duration?: number) => open({ type: 'info', text, duration }),
    warning: (text: string, duration?: number) => open({ type: 'warning', text, duration }),
    danger: (text: string, duration?: number) => open({ type: 'danger', text, duration }),
    closeAll,
  }
}

/* —— 命令式 API（任意位置 import { Message } 使用） —— */
export const Message = {
  open,
  success: (text: string, duration?: number) => open({ type: 'success', text, duration }),
  info: (text: string, duration?: number) => open({ type: 'info', text, duration }),
  warning: (text: string, duration?: number) => open({ type: 'warning', text, duration }),
  danger: (text: string, duration?: number) => open({ type: 'danger', text, duration }),
  closeAll,
}
