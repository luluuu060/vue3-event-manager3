/**
 * @file user.js
 * @description 用户状态管理模块
 * @description 管理用户 Token、基本信息及相关操作
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userInfoService } from '@/api/user'

export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const user = ref({})

    const setToken = (newToken) => {
      token.value = newToken
    }

    const removeToken = () => {
      token.value = ''
    }

    const getUser = async () => {
      const res = await userInfoService()
      user.value = res.data.data
    }

    const setUser = (obj) => {
      user.value = obj
    }

    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      setUser
    }
  },
  {
    persist: true
  }
)
