---
layout: home

hero:
  name: '@fzm/ui'
  text: 曜蓝机甲 Tech HUD
  tagline: 面向大屏数字孪生 / 工业监控 / 智慧中台的 Vue 3 科技风 UI 组件库（深色为主，含 2 套白色主题）
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 组件总览
      link: /components/tech-card

features:
  - title: 零运行时依赖
    details: 纯 CSS 变量驱动，组件库本身不引第三方。Vue / ECharts 作为 peerDependency，避免重复安装。
  - title: 10 套主题预设
    details: 8 深色 + 2 白色，通过 <html data-ui-style="xxx"> 一键换肤，组件 CSS、SVG 辉光、ECharts 图表三层联动。
  - title: 切角科技面板
    details: 八边形 clip-path 切角 + 顶部扫光线 + 左侧纵向光柱 + 主题色辉光，营造通电感的机甲仪表视觉。
  - title: ECharts 适配 + 机甲风预设
    details: useChartPalette 把 CSS 变量喂给 canvas 图表，切主题自动联动；buildLineChart/buildBarChart/buildPieChart 一行生成带辉光、菱形点、流光轨道、中心 KPI 的完整图表。
  - title: 双注册模式
    details: 支持 app.use(FzmUI) 全量注册，也支持 import { TechCard } 按需引入，Tree-shaking 友好。
  - title: TypeScript 完整类型
    details: 基于 <script setup lang="ts">，附带完整 Props / 类型定义与声明文件。
---
