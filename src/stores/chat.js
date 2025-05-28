import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateAIResponse } from '@/utils/ai'

export const useChatStore = defineStore('chat', () => {
  // 状态
  const chatHistory = ref([])
  const chats = ref({})
  const currentChatId = ref(null)
  const isLoading = ref(false)

  // 计算属性
  const currentChat = computed(() => {
    return currentChatId.value ? chats.value[currentChatId.value] : null
  })

  // 动作
  const createNewChat = () => {
    const chatId = Date.now().toString()
    const newChat = {
      id: chatId,
      title: '新对话',
      messages: [],
      lastMessage: new Date(),
      createdAt: new Date()
    }

    chats.value[chatId] = newChat
    chatHistory.value.unshift(newChat)
    currentChatId.value = chatId

    return chatId
  }

  const selectChat = (chatId) => {
    currentChatId.value = chatId
  }

  const deleteChat = (chatId) => {
    delete chats.value[chatId]
    chatHistory.value = chatHistory.value.filter(chat => chat.id !== chatId)

    if (currentChatId.value === chatId) {
      currentChatId.value = chatHistory.value.length > 0 ? chatHistory.value[0].id : null
    }
  }

  const sendMessage = async (content) => {
    if (!content.trim()) return

    // 如果没有当前对话，创建新对话
    if (!currentChatId.value) {
      createNewChat()
    }

    const chat = chats.value[currentChatId.value]

    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date()
    }

    chat.messages.push(userMessage)
    chat.lastMessage = new Date()

    // 更新对话标题
    if (chat.title === '新对话') {
      chat.title = content.length > 20 ? content.substring(0, 20) + '...' : content
    }

    isLoading.value = true

    // 模拟AI回复
    try {
      const response = await generateAIResponse(content)
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      chat.messages.push(aiMessage)
      chat.lastMessage = new Date()
    } catch (error) {
      console.error('AI回复失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // 状态
    chatHistory,
    chats,
    currentChatId,
    isLoading,
    // 计算属性
    currentChat,
    // 动作
    createNewChat,
    selectChat,
    deleteChat,
    sendMessage
  }
}) 