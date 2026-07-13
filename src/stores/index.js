/**
 * @file index.js
 * @description Pinia 状态管理入口
 * @description 配置 Pinia 插件并统一导出所有仓库模块
 */

import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

// 统一导出所有仓库模块
export * from './modules/user'
