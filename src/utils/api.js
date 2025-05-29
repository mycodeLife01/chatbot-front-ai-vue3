// API基础配置
const API_BASE_URL = 'http://localhost:8000'

// 本地存储的token key
const TOKEN_KEY = 'chatbot_token'

// 获取存储的token
const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

// 设置token到本地存储
const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}

// 清除token
const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

// 创建API请求函数
const apiRequest = async (url, options = {}) => {
  const token = getToken()
  
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  // 如果有token，添加到请求头
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: '请求失败' }))
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API请求错误:', error)
    throw error
  }
}

// 表单数据请求（用于文件上传）
const apiFormRequest = async (url, formData) => {
  const token = getToken()
  
  const config = {
    method: 'POST',
    headers: {}
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  config.body = formData

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: '请求失败' }))
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API请求错误:', error)
    throw error
  }
}

// 用户相关API
export const userAPI = {
  // 用户注册
  register: async (userData) => {
    console.log('API: 开始注册请求', userData.username)
    const response = await apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    console.log('API: 注册响应', response)
    if (response.access_token) {
      setToken(response.access_token)
      console.log('API: Token已保存')
    }
    return response
  },

  // 用户登录
  login: async (credentials) => {
    console.log('API: 开始登录请求', credentials.username)
    
    const formData = new FormData()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    console.log('API: 发送请求到', `${API_BASE_URL}/users/login`)

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        body: formData
      })

      console.log('API: 收到响应状态', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: '登录失败' }))
        console.error('API: 登录失败', errorData)
        throw new Error(errorData.detail || '登录失败')
      }

      const data = await response.json()
      console.log('API: 登录响应数据', data)
      
      if (data.access_token) {
        setToken(data.access_token)
        console.log('API: Token已保存到localStorage')
      } else {
        console.error('API: 响应中没有access_token')
      }
      
      return data
    } catch (error) {
      console.error('API: 登录请求异常', error)
      throw error
    }
  },

  // 退出登录
  logout: () => {
    console.log('API: 清除token')
    clearToken()
  }
}

// 聊天相关API
export const chatAPI = {
  // 获取所有聊天记录
  getAllChats: async () => {
    return await apiRequest('/chats/all')
  },

  // 创建新聊天
  createChat: async (chatData) => {
    return await apiRequest('/chats/new', {
      method: 'POST',
      body: JSON.stringify(chatData)
    })
  },

  // 更新聊天
  updateChat: async (chatData) => {
    return await apiRequest('/chats/update', {
      method: 'PUT',
      body: JSON.stringify(chatData)
    })
  },

  // 删除聊天
  deleteChat: async (chatId) => {
    return await apiRequest(`/chats/remove/${chatId}`, {
      method: 'DELETE'
    })
  }
}

// 消息相关API
export const messageAPI = {
  // 获取聊天消息
  getMessages: async (chatId) => {
    return await apiRequest(`/messages/?chat_id=${chatId}`)
  },

  // 发送消息
  sendMessage: async (messageData, files = null) => {
    const formData = new FormData()
    formData.append('chat_id', messageData.chat_id)
    formData.append('message_content', messageData.message_content)
    formData.append('is_ai', messageData.is_ai || 0)

    // 添加文件
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file)
      })
    }

    return await apiFormRequest('/messages/add', formData)
  },

  // 获取AI回复
  getAIResponse: async (chatId) => {
    return await apiRequest(`/messages/ai-response?chat_id=${chatId}`)
  }
}

// 工具函数
export { getToken, setToken, clearToken } 