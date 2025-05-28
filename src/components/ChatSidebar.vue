<template>
  <div :class="sidebarClasses">
    <!-- 侧边栏内容 -->
    <div v-show="!uiStore.sidebarCollapsed" class="flex flex-col h-full">
      <!-- 侧边栏头部 -->
      <div class="p-4 border-b border-gray-200 dark:border-dark-border">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold">对话</h2>
          <!-- 收起按钮在桌面端显示 -->
          <button 
            v-show="isDesktop"
            @click="uiStore.toggleSidebarCollapse"
            class="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors duration-200"
            title="折叠侧边栏">
            <CollapseIcon class="w-5 h-5" />
          </button>
        </div>
        <button 
          @click="handleNewChat"
          class="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
          <PlusIcon class="w-5 h-5 mr-2" />
          新建对话
        </button>
      </div>

      <!-- 对话历史 -->
      <div class="flex-1 overflow-y-auto p-2">
        <ChatHistoryItem
          v-for="chat in chatStore.chatHistory"
          :key="chat.id"
          :chat="chat"
          :isActive="chatStore.currentChatId === chat.id"
          @select="handleSelectChat"
          @delete="handleDeleteChat"
        />
      </div>

      <!-- 侧边栏底部 -->
      <div class="p-4 border-t border-gray-200 dark:border-dark-border">
        <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
          © 2024 AI助手
        </div>
      </div>
    </div>

    <!-- 收起状态下的小图标栏 -->
    <div v-show="uiStore.sidebarCollapsed" class="hidden md:flex flex-col items-center py-4 h-full">
      <button 
        @click="handleNewChat"
        class="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 mb-3"
        title="新建对话">
        <PlusIcon class="w-5 h-5" />
      </button>

      <!-- 收起状态下的对话历史指示器 -->
      <div class="flex-1 flex flex-col items-center space-y-2 overflow-y-auto">
        <div 
          v-for="chat in chatStore.chatHistory.slice(0, 5)" 
          :key="chat.id"
          @click="handleSelectChat(chat.id)"
          class="w-3 h-3 rounded-full cursor-pointer transition-colors duration-200"
          :class="chatStore.currentChatId === chat.id ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'"
          :title="chat.title">
        </div>
        <div 
          v-if="chatStore.chatHistory.length > 5" 
          class="text-xs text-gray-400 dark:text-gray-500 text-center">
          +{{ chatStore.chatHistory.length - 5 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useUIStore } from '@/stores/ui'
import ChatHistoryItem from './ChatHistoryItem.vue'
import PlusIcon from './icons/PlusIcon.vue'
import CollapseIcon from './icons/CollapseIcon.vue'

const chatStore = useChatStore()
const uiStore = useUIStore()

// 响应式桌面端检测
const isDesktop = ref(window.innerWidth >= 768)

const updateIsDesktop = () => {
  isDesktop.value = window.innerWidth >= 768
}

onMounted(() => {
  window.addEventListener('resize', updateIsDesktop)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsDesktop)
})

const sidebarClasses = computed(() => [
  'bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border sidebar-transition md:relative absolute z-30 h-full',
  uiStore.sidebarCollapsed ? 'w-0 md:w-16' : 'w-64',
  !uiStore.sidebarOpen && !uiStore.sidebarCollapsed ? 'sidebar-hidden' : ''
])

const handleNewChat = () => {
  chatStore.createNewChat()
  uiStore.autoCloseMobileSidebar()
}

const handleSelectChat = (chatId) => {
  chatStore.selectChat(chatId)
  uiStore.autoCloseMobileSidebar()
}

const handleDeleteChat = (chatId) => {
  chatStore.deleteChat(chatId)
}
</script> 