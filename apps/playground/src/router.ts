/**
 * 路由表
 *
 * 两套布局通过顶层路由分发布局：
 *  - DashboardLayout：大屏浮层架构（/ /edit），子路由渲染对应大屏视图
 *    （同一布局组件在多条路由间复用，3D 场景与 AppHeader 不重建）
 *  - DocLayout：文档布局（/intro 组件库说明、/theme 主题系统、/components/:name 各组件文档），
 *    左侧目录 + 右侧滚动内容
 *
 * /components 无 :name 时重定向到 /intro（组件库说明 / 使用指南）。
 */
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import DashboardLayout from './layouts/DashboardLayout.vue'
import DocLayout from './layouts/DocLayout.vue'
import DashboardView from './views/DashboardView.vue'
import EditModeView from './views/EditModeView.vue'
import IntroView from './views/IntroView.vue'
import ThemeView from './views/ThemeView.vue'
import ComponentDocView from './views/ComponentDocView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', name: 'dashboard', component: DashboardView },
      { path: 'edit', name: 'edit', component: EditModeView },
    ],
  },
  {
    path: '/components',
    component: DocLayout,
    children: [
      // 默认进入组件库说明页（使用指南）
      { path: '', redirect: '/intro' },
      { path: '/intro', name: 'intro', component: IntroView },
      { path: '/theme', name: 'theme', component: ThemeView },
      { path: ':name', name: 'component-doc', component: ComponentDocView },
    ],
  },
  // 兜底：未知路径回首页
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})
