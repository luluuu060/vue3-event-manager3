import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// element组件库（自动按需）(cv)
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // element组件库（自动按需）(cv)
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  // 配置基础路径（GitHub Pages仓库名）
  base: '/vue3-event-manager3/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 配置代理：解决跨域问题
  server: {
    // '/api' 代理到 https://big-event-vue-api-t.itheima.net
    // 在request.js中baseURL基地址为空字符串（分别配置以下两种不同的代理）
    // target: 目标服务器地址（真正的前缀地址）
    // 关键：vite代理一定要在proxy中配置！！
    proxy: {
      // 1. /api 前缀的接口（注册、登录等公共接口）
      '/api': {
        target: 'https://big-event-vue-api-t.itheima.net',
        changeOrigin: true,
        secure: false
      },
      // 2. /my 前缀的接口（需要 token 认证的接口）
      '/my': {
        target: 'https://big-event-vue-api-t.itheima.net',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
