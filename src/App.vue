<template>
  <div class="bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white transition-colors duration-300">
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
import { onMounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useUIStore } from '@/stores/ui'
import ChatSidebar from '@/components/ChatSidebar.vue'
import ChatHeader from '@/components/ChatHeader.vue'
import ChatMessages from '@/components/ChatMessages.vue'
import ChatInput from '@/components/ChatInput.vue'

const chatStore = useChatStore()
const uiStore = useUIStore()

onMounted(() => {
  // 初始化主题
  uiStore.initTheme()
  
  // 响应式侧边栏处理
  window.addEventListener('resize', uiStore.handleResize)
  uiStore.handleResize()
  
  // 创建初始对话
  chatStore.createNewChat()
})
</script> 