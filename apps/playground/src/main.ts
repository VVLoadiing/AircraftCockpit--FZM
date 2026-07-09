// 应用入口：创建并挂载根组件，注册路由，引入全局基础样式
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './main.css'

createApp(App).use(router).mount('#app')
