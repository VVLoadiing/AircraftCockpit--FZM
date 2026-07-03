import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      // 仅生成一次类型，包含 .vue 与 .ts
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
      cleanVueFileName: true,
      // 把 .vue 文件也产出对应的 d.ts
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    // 库模式
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FzmUI',
      fileName: 'fzm-ui',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // peer 依赖不打包
      external: ['vue', 'echarts'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          echarts: 'echarts',
        },
        // 统一产物样式文件名，与 exports['./styles'] 对齐
        assetFileNames: 'fzm-ui.[ext]',
      },
    },
  },
})
