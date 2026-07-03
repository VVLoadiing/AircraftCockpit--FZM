/**
 * useUiTheme — 主题切换机制
 * 来源：UI设计系统规范.md 第 10.3 / 11 章
 *
 * 原理：
 *  1. CSS 端用 :root[data-ui-style='xxx'] 覆盖变量
 *  2. JS 端改 <html data-ui-style> 属性即触发整套换肤
 *  3. localStorage 持久化选择，刷新后保持
 *  4. 图表通过 useChartPalette 的 computed 依赖 uiStyle 自动重算
 */
import { ref, computed } from 'vue'
import type { UiStyle, UiStyleOption } from '../types'
import { UI_STYLE_OPTIONS } from '../types'

const STORAGE_KEY = 'uiStyle'

/** SSR 安全读取 localStorage */
function readStored(): UiStyle {
  try {
    const v = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (v && UI_STYLE_OPTIONS.some((o) => o.id === v)) return v as UiStyle
  } catch {
    /* 忽略隐私模式等异常 */
  }
  return 'transparent'
}

/** 全局唯一主题状态（模块单例，多组件共享） */
export const uiStyle = ref<UiStyle>(readStored())

/** 当前主题元信息 */
export const currentUiStyle = computed<UiStyleOption>(
  () => UI_STYLE_OPTIONS.find((o) => o.id === uiStyle.value) ?? UI_STYLE_OPTIONS[0],
)

/** 把 data-ui-style 写到 <html> 上 */
function applyToDom(style: UiStyle) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-ui-style', style)
  }
}

/** 切换主题 */
export function setUiStyle(style: UiStyle) {
  if (style === uiStyle.value) return
  uiStyle.value = style
  try {
    localStorage.setItem(STORAGE_KEY, style)
  } catch {
    /* 忽略写入异常 */
  }
  applyToDom(style)
}

/** 初始化（App 启动时调用一次，把已存风格恢复到 DOM） */
export function initUiStyle() {
  applyToDom(uiStyle.value)
}

/**
 * 组合式函数：返回主题状态与切换方法
 * @example
 * const { style, setStyle, options } = useUiTheme()
 */
export function useUiTheme() {
  return {
    /** 当前主题 id（响应式） */
    style: uiStyle,
    /** 当前主题元信息 */
    current: currentUiStyle,
    /** 全部主题选项 */
    options: UI_STYLE_OPTIONS,
    /** 切换主题 */
    setStyle: setUiStyle,
    /** 初始化（同步 DOM） */
    init: initUiStyle,
  }
}
