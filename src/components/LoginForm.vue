<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ isLogin ? '登录聊天机器人' : '注册新账户' }}
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">用户名</label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="用户名"
            />
          </div>
          <div>
            <label for="password" class="sr-only">密码</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              :class="{ 'rounded-b-md': isLogin }"
              placeholder="密码"
            />
          </div>
          <div v-if="!isLogin">
            <label for="confirmPassword" class="sr-only">确认密码</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="确认密码"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="mr-2">
              <LoadingIndicator />
            </span>
            {{ isLogin ? '登录' : '注册' }}
          </button>
        </div>

        <div class="text-center">
          <button
            type="button"
            @click="toggleMode"
            class="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {{ isLogin ? '没有账户？立即注册' : '已有账户？立即登录' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LoadingIndicator from './LoadingIndicator.vue'

const authStore = useAuthStore()

const isLogin = ref(true)
const loading = ref(false)
const error = ref('')

const form = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
  // 清空表单
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
}

const handleSubmit = async () => {
  console.log('表单提交开始')
  error.value = ''
  
  if (!form.username || !form.password) {
    error.value = '请填写所有必填字段'
    return
  }

  if (!isLogin.value) {
    if (form.password !== form.confirmPassword) {
      error.value = '两次输入的密码不一致'
      return
    }
    if (form.username.length < 4) {
      error.value = '用户名长度至少为4位'
      return
    }
    if (form.password.length < 6) {
      error.value = '密码长度至少为6位'
      return
    }
  }

  loading.value = true
  console.log('开始认证请求:', isLogin.value ? '登录' : '注册')

  try {
    let result
    if (isLogin.value) {
      console.log('调用登录方法')
      result = await authStore.login({
        username: form.username,
        password: form.password
      })
      console.log('登录调用完成，结果:', result)
    } else {
      console.log('调用注册方法')
      result = await authStore.register({
        username: form.username,
        password: form.password,
        repeat_password: form.confirmPassword
      })
      console.log('注册调用完成，结果:', result)
    }
    
    console.log('认证成功！检查状态:', {
      isAuthenticated: authStore.isAuthenticated,
      isLoggedIn: authStore.isLoggedIn,
      user: authStore.user
    })
    
    // 成功后清空表单
    Object.keys(form).forEach(key => {
      form[key] = ''
    })
    
  } catch (err) {
    console.error('认证失败:', err)
    error.value = err.message || (isLogin.value ? '登录失败' : '注册失败')
  } finally {
    loading.value = false
    console.log('认证请求结束')
  }
}
</script> 