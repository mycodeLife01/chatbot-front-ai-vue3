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
            title: chat.chat_name || '新对话',
            messages: [],
            lastMessage: chat.update_time,
            createdAt: chat.create_time
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
        chat_name: '新对话'
      }
      
      const newChatResponse = await chatAPI.createChat(chatData)
      console.log('新聊天创建响应:', newChatResponse)
      
      const newChat = {
        id: newChatResponse.chat_id,
        title: newChatResponse.chat_name || '新对话',
        messages: [],
        lastMessage: newChatResponse.update_time, // 使用正确的字段名 update_time
        createdAt: newChatResponse.create_time // 使用正确的字段名 create_time
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
        chats.value[chatId].messages = messages.map(msg => {
          // 处理消息内容，确保是字符串
          let content = msg.message_content
          if (typeof content !== 'string') {
            console.warn('历史消息内容不是字符串:', content, typeof content)
            content = String(content || '消息内容格式错误')
          }
          
          // 尝试多个可能的时间戳字段名
          let timestamp = msg.create_time || msg.created_time || msg.timestamp
          
          // 如果时间戳是数字（Unix时间戳），确保它是毫秒级的
          if (typeof timestamp === 'number') {
            // 如果是秒级时间戳（小于13位），转换为毫秒级
            if (timestamp < 1000000000000) {
              timestamp = timestamp * 1000
            }
          }
          
          return {
            id: msg.message_id,
            role: msg.is_ai ? 'assistant' : 'user',
            content: content,
            timestamp: timestamp,
            files: msg.files || []
          }
        })
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
        chat_name: newTitle
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
      timestamp: Date.now(), // 使用毫秒级时间戳保持一致性
      files: files || []
    }

    chat.messages.push(userMessage)
    chat.lastMessage = Date.now()

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
        // 异步更新标题，不阻塞消息流程
        updateChatTitle(currentChatId.value, newTitle).catch(error => {
          console.warn('更新聊天标题失败，但不影响消息发送:', error)
        })
      }

      console.log('开始获取AI回复')
      // 获取AI回复
      const aiResponse = await messageAPI.getAIResponse(currentChatId.value)
      console.log('AI回复数据:', aiResponse)
      console.log('AI回复数据类型:', typeof aiResponse)
      
      // 处理不同格式的AI回复
      let aiContent = null
      let aiMessageId = null
      let aiTimestamp = null
      
      if (typeof aiResponse === 'string') {
        // 如果响应直接是字符串
        aiContent = aiResponse
        aiMessageId = Date.now() + 1
        aiTimestamp = Date.now()
        console.log('AI回复是字符串，长度:', aiContent.length)
      } else if (aiResponse && typeof aiResponse === 'object') {
        // 如果响应是对象，尝试提取内容
        if (aiResponse.message_content) {
          aiContent = aiResponse.message_content
        } else if (aiResponse.content) {
          aiContent = aiResponse.content
        } else {
          // 如果都没有，可能整个对象就是内容（但这通常不对）
          console.warn('无法从对象中提取AI内容:', aiResponse)
          aiContent = '抱歉，AI回复格式错误。'
        }
        
        aiMessageId = aiResponse.message_id || Date.now() + 1
        
        // 处理时间戳
        let rawTimestamp = aiResponse.create_time || aiResponse.created_time || aiResponse.timestamp
        if (typeof rawTimestamp === 'number') {
          // 如果是秒级时间戳，转换为毫秒级
          aiTimestamp = rawTimestamp < 1000000000000 ? rawTimestamp * 1000 : rawTimestamp
        } else {
          aiTimestamp = Date.now()
        }
        console.log('AI回复是对象，提取内容类型:', typeof aiContent)
      } else {
        console.warn('AI回复格式未知:', aiResponse)
        aiContent = '抱歉，AI回复格式错误。'
        aiMessageId = Date.now() + 1
        aiTimestamp = Date.now()
      }
      
      console.log('最终AI内容类型:', typeof aiContent, '长度:', aiContent?.length)
      
      if (aiContent && typeof aiContent === 'string' && aiContent.trim()) {
        const aiMessage = {
          id: aiMessageId,
          role: 'assistant',
          content: aiContent,
          timestamp: aiTimestamp,
          files: (aiResponse && aiResponse.files) || []
        }

        console.log('添加AI消息，内容预览:', aiContent.substring(0, 50) + '...')
        
        // 确保响应式更新
        chat.messages.push(aiMessage)
        chat.lastMessage = aiTimestamp
        
        console.log('消息添加完成，总数:', chat.messages.length)
      } else {
        console.warn('AI回复内容无效，类型:', typeof aiContent, '内容:', aiContent)
        
        // 添加一个默认的错误消息
        const errorMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: '抱歉，没有收到AI回复，请稍后重试。',
          timestamp: Date.now(),
          isError: true
        }
        
        chat.messages.push(errorMessage)
        chat.lastMessage = Date.now()
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      
      // 如果发送失败，添加错误提示
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '抱歉，发送消息时出现错误，请稍后重试。',
        timestamp: Date.now(),
        isError: true
      }
      
      chat.messages.push(errorMessage)
      chat.lastMessage = Date.now()
    } finally {
      isLoading.value = false
      console.log('消息发送流程结束，最终消息数量:', chat.messages.length)
      
      // 确保Vue响应式系统正确更新
      // 强制触发响应式更新
      const currentChatRef = chats.value[currentChatId.value]
      if (currentChatRef) {
        console.log('强制更新响应式状态')
        // 这将触发响应式更新
        currentChatRef.messages = [...currentChatRef.messages]
      }
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