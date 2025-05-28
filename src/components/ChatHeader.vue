<template>
  <div class="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border p-4 flex items-center justify-between">
    <div class="flex items-center">
      <!-- 移动端侧边栏切换按钮 -->
      <button 
        @click="uiStore.toggleSidebar"
        class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border mr-3">
        <MenuIcon class="w-6 h-6" />
      </button>
      
      <!-- 侧边栏展开按钮（当侧边栏收起时显示） -->
      <button 
        v-if="uiStore.sidebarCollapsed" 
        @click="uiStore.toggleSidebarCollapse"
        class="hidden md:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border mr-3"
        title="展开侧边栏">
        <ExpandIcon class="w-6 h-6" />
      </button>
      
      <h1 class="text-xl font-semibold gradient-text">AI助手</h1>
    </div>
    
    <div class="flex items-center space-x-3">
      <span class="text-sm text-gray-500 dark:text-gray-400">
        {{ chatStore.currentChat?.title || '新对话' }}
      </span>
      
      <!-- 深色模式切换按钮 -->
      <button 
        @click="uiStore.toggleTheme"
        class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors duration-200"
        :title="uiStore.darkMode ? '切换到浅色模式' : '切换到深色模式'">
        <SunIcon v-if="uiStore.darkMode" class="w-5 h-5" />
        <MoonIcon v-else class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { useChatStore } from '@/stores/chat'
import { useUIStore } from '@/stores/ui'
import MenuIcon from './icons/MenuIcon.vue'
import ExpandIcon from './icons/ExpandIcon.vue'
import SunIcon from './icons/SunIcon.vue'
import MoonIcon from './icons/MoonIcon.vue'

const chatStore = useChatStore()
const uiStore = useUIStore()
</script> 