/**
 * @file request.js
 * @description Axios 请求封装模块
 * @description 提供统一的请求拦截、响应处理、错误处理能力
 */

import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 后端接口地址
// 开发环境使用 Vite 代理（baseURL为空，通过代理匹配 /api 和 /my）
// 生产环境（GitHub Pages）直接使用完整地址（无代理）
const baseURL = import.meta.env.PROD
  ? 'https://big-event-vue-api-t.itheima.net'
  : ''

// 用于拼接图片完整地址
export const apiBaseURL = 'https://big-event-vue-api-t.itheima.net'

/**
 * 创建 Axios 实例
 * @param {Object} config - Axios 配置对象
 * @returns {AxiosInstance} - Axios 实例
 */
const instance = axios.create({
  baseURL,
  timeout: 15000
})

/**
 * 请求拦截器
 * 自动携带 Token 到请求头
 */
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

/**
 * 响应拦截器
 * 统一处理响应数据和错误
 */
instance.interceptors.response.use(
  (res) => {
    if (res.data.code === 0) {
      return res
    }
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    if (err.response?.status === 401) {
      router.push('/login')
    }
    ElMessage.error(err.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
