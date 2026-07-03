import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * playground 指向 @fzm/ui 的源码（而非构建产物），
 * 这样开发时享有 HMR 热更新，且无需每次改组件都先 build。
 * 消费方（发布后）则用包根入口 '@fzm/ui' 即可。
 */
const uiSrc = resolve(__dirname, '../../packages/ui/src')

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // @fzm/ui 与 @fzm/ui/styles 指向源码
      '@fzm/ui/styles': resolve(uiSrc, 'styles/index.css'),
      '@fzm/ui': uiSrc,
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
