import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@fzm/ui',
  description: '曜蓝机甲 Tech HUD —— Vue 3 深色科技风 UI 组件库',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,

  themeConfig: {
    siteTitle: '@fzm/ui · Tech HUD',
    outline: { level: [2, 3], label: '本页导航' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdatedText: '最后更新',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',

    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '组件', link: '/components/tech-card' },
      { text: 'Playground', link: 'http://localhost:5173' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '主题系统', link: '/guide/theming' },
            { text: 'ECharts 图表适配', link: '/guide/charts' },
            { text: '机甲风图表预设', link: '/guide/chart-presets' },
            { text: '发布到 npm', link: '/guide/publish' },
            { text: 'FAQ', link: '/guide/faq' },
          ],
        },
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'TechCard 科技面板', link: '/components/tech-card' },
            { text: 'GlassPanel 玻璃浮层', link: '/components/glass-panel' },
            { text: 'FzGlass 黑色玻璃浮窗', link: '/components/fz-glass' },
          ],
        },
        {
          text: '数据展示',
          items: [
            { text: 'KpiItem KPI 大数字', link: '/components/kpi-item' },
            { text: 'MetricBox 统计方块', link: '/components/metric-box' },
            { text: 'DataRow 数据行', link: '/components/data-row' },
            { text: 'TechRow 科技列表项', link: '/components/tech-row' },
            { text: 'BaseChart 图表封装', link: '/components/base-chart' },
          ],
        },
        {
          text: '反馈与标识',
          items: [
            { text: 'StatusDot 状态点', link: '/components/status-dot' },
            { text: 'CountBadge 计数徽章', link: '/components/count-badge' },
            { text: 'LevelBadge 告警等级', link: '/components/level-badge' },
            { text: 'ProgressBar 进度条', link: '/components/progress-bar' },
            { text: 'HudButton 按钮', link: '/components/hud-button' },
            { text: 'HudChip 提示标签', link: '/components/hud-chip' },
          ],
        },
        {
          text: '布局',
          items: [
            { text: 'HudFrame HUD 边框', link: '/components/hud-frame' },
            { text: 'Sidebar 侧栏', link: '/components/sidebar' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/' }],

    footer: {
      message: '基于 Vue 3 + CSS 变量 · 设计语言：曜蓝机甲 Tech HUD',
      copyright: 'MIT License',
    },

    search: { provider: 'local' },
  },
})
