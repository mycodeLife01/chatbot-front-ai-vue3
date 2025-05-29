<template>
  <!-- 调试信息 -->
  <!-- <div v-if="true" class="fixed top-0 left-0 bg-red-500 text-white p-2 text-xs z-50">
    调试: isLoggedIn={{ authStore.isLoggedIn }}, isAuthenticated={{ authStore.isAuthenticated }}, hasToken={{ !!getToken() }}
  </div> -->
  
  <!-- 未登录时显示登录表单 -->
  <LoginForm v-if="!authStore.isLoggedIn" />
  
  <!-- 已登录时显示聊天界面 -->
  <div v-else class="bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white transition-colors duration-300">
    <!-- 主容器 -->
    <div class="flex h-screen overflow-hidden">
      <!-- 侧边栏 -->
      <ChatSidebar />
      
      <!-- 主聊天区域 -->
      <div class="flex-1 flex flex-col">
        <!-- 顶部栏 -->
        <ChatHeader />
        
        <!-- 聊天消息区域 -->
        <ChatMessages />
        
        <!-- 输入区域 -->
        <ChatInput />
      </div>
    </div>
    
    <!-- 移动端遮罩层 -->
    <div 
      v-if="uiStore.sidebarOpen && !uiStore.sidebarCollapsed" 
      @click="uiStore.closeSidebar"
      class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20">
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import { getToken } from '@/utils/api'
import ChatSidebar from '@/components/ChatSidebar.vue'
import ChatHeader from '@/components/ChatHeader.vue'
import ChatMessages from '@/components/ChatMessages.vue'
import ChatInput from '@/components/ChatInput.vue'
import LoginForm from '@/components/LoginForm.vue'

const chatStore = useChatStore()
const uiStore = useUIStore()
const authStore = useAuthStore()

// 监听登录状态变化
watch(
  () => authStore.isLoggedIn,
  async (newValue, oldValue) => {
    console.log('登录状态变化:', { from: oldValue, to: newValue })
    
    if (newValue && !oldValue) {
      console.log('用户刚刚登录，准备加载聊天数据')
      await nextTick() // 等待DOM更新
      
      try {
        await chatStore.loadAllChats()
        console.log('聊天数据加载完成，聊天数量:', chatStore.chatHistory.length)
        
        // 如果没有聊天记录，创建一个新的
        if (chatStore.chatHistory.length === 0) {
          console.log('没有聊天记录，创建新聊天')
          await chatStore.createNewChat()
        } else {
          // 选择第一个聊天
          console.log('选择第一个聊天')
          chatStore.selectChat(chatStore.chatHistory[0].id)
        }
      } catch (error) {
        console.error('加载聊天数据失败:', error)
      }
    }
  },
  { immediate: false }
)

onMounted(async () => {
  console.log('App组件挂载，开始初始化')
  
  // 检查认证状态
  authStore.checkAuth()
  console.log('认证检查完成，当前状态:', {
    isLoggedIn: authStore.isLoggedIn,
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!getToken()
  })
  
  // 初始化主题
  uiStore.initTheme()
  
  // 响应式侧边栏处理
  window.addEventListener('resize', uiStore.handleResize)
  uiStore.handleResize()
  
  // 如果已经登录，直接加载聊天数据
  if (authStore.isLoggedIn) {
    console.log('已登录状态，加载聊天数据')
    try {
      await chatStore.loadAllChats()
      
      // 如果没有聊天记录，创建一个新的
      if (chatStore.chatHistory.length === 0) {
        await chatStore.createNewChat()
      } else {
        // 选择第一个聊天
        chatStore.selectChat(chatStore.chatHistory[0].id)
      }
    } catch (error) {
      console.error('初始加载聊天数据失败:', error)
    }
  }
})
</script> 