import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userAPI, getToken } from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const isAuthenticated = ref(false)
  const user = ref(null)
  const loading = ref(false)

  // 计算属性
  const isLoggedIn = computed(() => isAuthenticated.value && !!getToken())

  // 动作
  const login = async (credentials) => {
    loading.value = true
    try {
      console.log('开始登录:', credentials.username)
      const response = await userAPI.login(credentials)
      console.log('登录响应:', response)
      
      if (response.access_token) {
        isAuthenticated.value = true
        user.value = { username: credentials.username }
        console.log('登录成功，状态已更新')
        return response
      } else if (response.code === 2003) {
        console.log("服务端返回：" + response.code);
        throw new Error('用户密码错误')
      } else if (response.code === 2002) {
        console.log("服务端返回：" + response.code);
        throw new Error('用户不存在')
      } else {
        throw new Error('未收到有效的访问令牌')
      }
    } catch (error) {
      console.error('登录失败:', error)
      isAuthenticated.value = false
      user.value = null
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    try {
      console.log('开始注册:', userData.username)
      const response = await userAPI.register(userData)
      console.log('注册响应:', response)
      
      if (response.access_token) {
        isAuthenticated.value = true
        user.value = { username: userData.username }
        console.log('注册成功，状态已更新')
        return response
      } else if (response.code === 2001) {
        console.log("服务端返回：" + response.code);
        throw new Error('用户已存在')
      } else {
        throw new Error('未收到有效的访问令牌')
      }
    } catch (error) {
      console.error('注册失败:', error)
      isAuthenticated.value = false
      user.value = null
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    console.log('用户退出登录')
    userAPI.logout()
    isAuthenticated.value = false
    user.value = null
  }

  const checkAuth = () => {
    const token = getToken()
    console.log('检查认证状态，token:', token ? '存在' : '不存在')
    if (token) {
      isAuthenticated.value = true
      // 如果没有用户信息，设置一个默认的
      if (!user.value) {
        user.value = { username: 'User' }
      }
      console.log('认证状态设置为已登录')
    } else {
      isAuthenticated.value = false
      user.value = null
      console.log('认证状态设置为未登录')
    }
  }

  return {
    // 状态
    isAuthenticated,
    user,
    loading,
    // 计算属性
    isLoggedIn,
    // 动作
    login,
    register,
    logout,
    checkAuth
  }
}) 