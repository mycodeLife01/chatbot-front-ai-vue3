import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { chatAPI, messageAPI } from '@/utils/api'

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
  const loadAllChats = async () => {
    try {
      console.log('开始加载所有聊天记录')
      const chatsData = await chatAPI.getAllChats()
      console.log('收到聊天数据:', chatsData)
      
      // 清空现有数据
      chatHistory.value = []
      chats.value = {}
      
      // 处理聊天数据
      if (chatsData && chatsData.length > 0) {
        chatsData.forEach(chat => {
          const processedChat = {
            id: chat.chat_id,
            title: chat.title || '新对话',
            messages: [],
            lastMessage: chat.updated_time, // 保持原始格式
            createdAt: chat.created_time // 保持原始格式
          }
          
          chats.value[chat.chat_id] = processedChat
          chatHistory.value.push(processedChat)
        })
        
        // 按最后消息时间排序
        chatHistory.value.sort((a, b) => {
          const timeA = new Date(a.lastMessage).getTime()
          const timeB = new Date(b.lastMessage).getTime()
          return timeB - timeA // 降序排列
        })
        
        console.log('聊天记录加载完成，数量:', chatHistory.value.length)
      } else {
        console.log('没有聊天记录')
      }
    } catch (error) {
      console.error('加载聊天记录失败:', error)
    }
  }

  const createNewChat = async () => {
    try {
      console.log('开始创建新聊天')
      const chatData = {
        title: '新对话',
        description: ''
      }
      
      const newChatResponse = await chatAPI.createChat(chatData)
      console.log('新聊天创建响应:', newChatResponse)
      
      const newChat = {
        id: newChatResponse.chat_id,
        title: newChatResponse.title,
        messages: [],
        lastMessage: newChatResponse.updated_time, // 保持原始格式
        createdAt: newChatResponse.created_time // 保持原始格式
      }

      chats.value[newChatResponse.chat_id] = newChat
      chatHistory.value.unshift(newChat)
      currentChatId.value = newChatResponse.chat_id

      console.log('新聊天创建成功，ID:', newChatResponse.chat_id)
      return newChatResponse.chat_id
    } catch (error) {
      console.error('创建新聊天失败，将使用本地创建:', error)
      
      // 如果API调用失败，使用本地创建
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

      console.log('本地聊天创建完成，ID:', chatId)
      return chatId
    }
  }

  const selectChat = async (chatId) => {
    console.log('选择聊天:', chatId, '当前聊天:', currentChatId.value)
    
    // 如果是同一个聊天且正在加载中，不重新加载消息
    if (currentChatId.value === chatId && isLoading.value) {
      console.log('正在加载中，跳过消息重新加载')
      return
    }
    
    currentChatId.value = chatId
    
    // 只有在切换到不同的聊天或者当前聊天没有消息时才加载消息
    if (chats.value[chatId] && chats.value[chatId].messages.length === 0) {
      console.log('聊天消息为空，加载消息')
      await loadChatMessages(chatId)
    } else {
      console.log('聊天已有消息，跳过加载')
    }
  }

  const loadChatMessages = async (chatId) => {
    try {
      console.log('加载聊天消息:', chatId)
      const messages = await messageAPI.getMessages(chatId)
      console.log('收到消息数据:', messages)
      
      if (chats.value[chatId]) {
        chats.value[chatId].messages = messages.map(msg => ({
          id: msg.message_id,
          role: msg.is_ai ? 'assistant' : 'user',
          content: msg.message_content,
          timestamp: msg.created_time, // 保持原始格式，让formatTime函数处理
          files: msg.files || []
        }))
        console.log('消息加载完成，数量:', chats.value[chatId].messages.length)
      }
    } catch (error) {
      console.error('加载消息失败:', error)
    }
  }

  const deleteChat = async (chatId) => {
    try {
      await chatAPI.deleteChat(chatId)
      
      delete chats.value[chatId]
      chatHistory.value = chatHistory.value.filter(chat => chat.id !== chatId)

      if (currentChatId.value === chatId) {
        currentChatId.value = chatHistory.value.length > 0 ? chatHistory.value[0].id : null
      }
    } catch (error) {
      console.error('删除聊天失败:', error)
    }
  }

  const updateChatTitle = async (chatId, newTitle) => {
    try {
      await chatAPI.updateChat({
        chat_id: chatId,
        title: newTitle
      })
      
      if (chats.value[chatId]) {
        chats.value[chatId].title = newTitle
      }
    } catch (error) {
      console.error('更新聊天标题失败:', error)
    }
  }

  const sendMessage = async (content, files = null) => {
    if (!content.trim()) return

    // 如果没有当前对话，创建新对话
    if (!currentChatId.value) {
      await createNewChat()
    }

    const chat = chats.value[currentChatId.value]
    if (!chat) {
      console.error('当前聊天对象不存在')
      return
    }

    // 添加用户消息到本地状态
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date(),
      files: files || []
    }

    chat.messages.push(userMessage)
    chat.lastMessage = new Date()

    isLoading.value = true

    try {
      console.log('开始发送消息到后端:', content)
      
      // 发送消息到后端
      const messageData = {
        chat_id: currentChatId.value,
        message_content: content,
        is_ai: 0
      }
      
      const sentMessage = await messageAPI.sendMessage(messageData, files)
      console.log('消息发送成功:', sentMessage)
      
      // 更新本地消息ID
      const userMsgIndex = chat.messages.findIndex(msg => msg.id === userMessage.id)
      if (userMsgIndex !== -1) {
        chat.messages[userMsgIndex].id = sentMessage.message_id
      }

      // 更新对话标题
      if (chat.title === '新对话') {
        const newTitle = content.length > 20 ? content.substring(0, 20) + '...' : content
        chat.title = newTitle
        await updateChatTitle(currentChatId.value, newTitle)
      }

      console.log('开始获取AI回复')
      // 获取AI回复
      const aiResponse = await messageAPI.getAIResponse(currentChatId.value)
      console.log('AI回复数据:', aiResponse)
      
      if (aiResponse && aiResponse.message_content) {
        // 确保时间戳格式正确
        let timestamp = aiResponse.created_time
        if (!timestamp) {
          timestamp = Date.now() // 使用当前时间作为备选
          console.warn('AI回复没有时间戳，使用当前时间')
        }
        
        const aiMessage = {
          id: aiResponse.message_id || Date.now() + 1,
          role: 'assistant',
          content: aiResponse.message_content,
          timestamp: timestamp,
          files: aiResponse.files || []
        }

        console.log('添加AI消息到聊天:', aiMessage)
        chat.messages.push(aiMessage)
        chat.lastMessage = timestamp
        
        console.log('当前聊天消息数量:', chat.messages.length)
      } else {
        console.warn('AI回复为空或无效')
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      
      // 如果发送失败，添加错误提示
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '抱歉，发送消息时出现错误，请稍后重试。',
        timestamp: new Date(),
        isError: true
      }
      
      chat.messages.push(errorMessage)
    } finally {
      isLoading.value = false
      console.log('消息发送流程结束')
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
    loadAllChats,
    createNewChat,
    selectChat,
    loadChatMessages,
    deleteChat,
    updateChatTitle,
    sendMessage
  }
}) 