import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * playground 指向 @fzm-tech-hud/ui 的源码（而非构建产物），
 * 这样开发时享有 HMR 热更新，且无需每次改组件都先 build。
 * 消费方（发布后）则用包根入口 '@fzm-tech-hud/ui' 即可。
 */
const uiSrc = resolve(__dirname, '../../packages/ui/src')

export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // @fzm-tech-hud/ui 与 @fzm-tech-hud/ui/styles 指向源码
      '@fzm-tech-hud/ui/styles': resolve(uiSrc, 'styles/index.css'),
      '@fzm-tech-hud/ui': uiSrc,
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
