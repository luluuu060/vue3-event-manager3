/**
 * @file main.js
 * @description 应用入口文件，创建 Vue 实例并挂载到 DOM
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/stores'
import '@/assets/main.scss'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
