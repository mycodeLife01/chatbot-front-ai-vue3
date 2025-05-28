import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // 状态
  const darkMode = ref(false)
  const sidebarOpen = ref(true)
  const sidebarCollapsed = ref(false)

  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme !== null) {
      darkMode.value = JSON.parse(savedTheme)
    } else {
      // 检测系统主题偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      darkMode.value = prefersDark
    }
    applyTheme()
  }

  // 应用主题
  const applyTheme = () => {
    document.documentElement.classList.toggle('dark', darkMode.value)
  }

  // 切换主题
  const toggleTheme = () => {
    darkMode.value = !darkMode.value
    applyTheme()
    localStorage.setItem('darkMode', darkMode.value)
  }

  // 切换侧边栏（移动端）
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  // 关闭侧边栏
  const closeSidebar = () => {
    sidebarOpen.value = false
  }

  // 切换侧边栏收起状态（桌面端）
  const toggleSidebarCollapse = () => {
    // 只在桌面端允许收起功能
    if (window.innerWidth >= 768) {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }
  }

  // 响应式处理
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      sidebarOpen.value = true
    } else {
      sidebarOpen.value = false
      // 在移动端重置收起状态
      sidebarCollapsed.value = false
    }
  }

  // 自动关闭移动端侧边栏
  const autoCloseMobileSidebar = () => {
    if (window.innerWidth < 768) {
      sidebarOpen.value = false
    }
  }

  return {
    // 状态
    darkMode,
    sidebarOpen,
    sidebarCollapsed,
    // 动作
    initTheme,
    toggleTheme,
    toggleSidebar,
    closeSidebar,
    toggleSidebarCollapse,
    handleResize,
    autoCloseMobileSidebar
  }
}) 