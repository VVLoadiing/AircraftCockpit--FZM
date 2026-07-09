import type { ComponentDoc } from '../types'
import Basic from '../examples/app-header/Basic.vue'
import BasicSource from '../examples/app-header/Basic.vue?raw'

export default {
  name: 'app-header',
  title: 'AppHeader 应用头部',
  category: '布局',
  description: '应用级机甲风头部浮条，复刻大屏标准布局的顶部浮条。',
  intro: [
    '视觉特征：毛玻璃浮条底 + 左上/右上 HUD 切角标记 + 渐变机甲标题（白→主题色）+ 电流母线 spacer（流动脉冲）+ 右侧状态组（地域/天气/系统状态/告警铃铛/实时时钟）+ 用户菜单。',
    '内置功能：用户菜单含主题切换下拉（带彩色圆点）+ 全屏切换。主题切换自动持久化。floating=true 时 fixed 贴顶（大屏用法），false 时随文档流。',
  ],
  demos: [{ title: '基础用法（文档流模式）', component: Basic, source: BasicSource }],
  props: [
    { name: 'title', type: 'string', default: "'曜蓝机甲 Tech HUD'", desc: '主标题（渐变文字）' },
    { name: 'subtitle', type: 'string', default: "'TECH HUD · ...'", desc: '副标题（英文/小字）' },
    { name: 'logo', type: 'string', default: "''", desc: 'logo 图片地址（不传则显示主题色方块占位）' },
    { name: 'region', type: 'string', default: "''", desc: '地域文字，空则不显示' },
    { name: 'weather', type: 'string', default: "''", desc: '天气文字，空则不显示' },
    { name: 'alarmCount', type: 'number', default: '0', desc: '告警数（铃铛角标，>99 显示 99+，0 不显示）' },
    { name: 'systemStatus', type: 'string', default: "'系统运行中'", desc: '系统状态文字' },
    { name: 'userName', type: 'string', default: "'管理员'", desc: '用户名' },
    { name: 'showUserMenu', type: 'boolean', default: 'true', desc: '是否显示用户菜单（主题切换/全屏）' },
    { name: 'floating', type: 'boolean', default: 'false', desc: '是否浮动定位（fixed 贴顶）；false 则随文档流' },
  ],
  slots: [
    { name: 'actions', desc: '状态组前置插槽（插入额外的 chip / 按钮）' },
    { name: 'menu', desc: '用户菜单底部追加的自定义菜单项' },
  ],
  events: [
    { name: 'alarm-click', params: '-', desc: '点击告警铃铛时触发' },
    { name: 'theme-change', params: "(value: UiStyle['id'])", desc: '用户在菜单切换主题时触发' },
  ],
} satisfies ComponentDoc
