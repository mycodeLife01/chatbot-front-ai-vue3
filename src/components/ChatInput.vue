<template>
  <div class="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border p-4">
    <div class="max-w-4xl mx-auto">
      <!-- 文件预览区域 -->
      <div v-if="selectedFiles.length > 0" class="mb-3">
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="(file, index) in selectedFiles" 
            :key="index"
            class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            <span class="truncate max-w-32">{{ file.name }}</span>
            <button 
              @click="removeFile(index)"
              class="ml-2 text-gray-500 hover:text-red-500"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-end space-x-3">
        <!-- 文件上传按钮 -->
        <button 
          @click="triggerFileInput"
          class="p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors duration-200"
          title="上传文件">
          <AttachIcon class="w-5 h-5" />
        </button>
        
        <input 
          ref="fileInput"
          type="file"
          multiple
          @change="handleFileSelect"
          class="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />

        <div class="flex-1 min-w-0">
          <div class="relative">
            <textarea 
              v-model="inputMessage"
              @keydown="handleKeydown"
              placeholder="询问任何问题"
              class="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              rows="1" 
              :disabled="chatStore.isLoading" 
              ref="messageInput">
            </textarea>

            <!-- 发送按钮 -->
            <button 
              @click="sendMessage"
              :disabled="(!inputMessage.trim() && selectedFiles.length === 0) || chatStore.isLoading"
              class="absolute bottom-3 right-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200">
              <SendIcon v-if="!chatStore.isLoading" class="w-5 h-5" />
              <SpinnerIcon v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
        AI助手可能会出错，请核实重要信息。
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'
import SendIcon from './icons/SendIcon.vue'
import SpinnerIcon from './icons/SpinnerIcon.vue'
import AttachIcon from './icons/AttachIcon.vue'

const chatStore = useChatStore()
const inputMessage = ref('')
const messageInput = ref(null)
const fileInput = ref(null)
const selectedFiles = ref([])

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value.push(...files)
  // 清空input以允许重复选择同一文件
  event.target.value = ''
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const sendMessage = async () => {
  if ((!inputMessage.value.trim() && selectedFiles.value.length === 0) || chatStore.isLoading) return
  
  const message = inputMessage.value || '发送了文件'
  const files = selectedFiles.value.length > 0 ? [...selectedFiles.value] : null
  
  inputMessage.value = ''
  selectedFiles.value = []
  
  await chatStore.sendMessage(message, files)
  
  // 发送后重新聚焦输入框
  await nextTick()
  if (messageInput.value) {
    messageInput.value.focus()
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

onMounted(() => {
  // 初始聚焦输入框
  if (messageInput.value) {
    messageInput.value.focus()
  }
})

defineExpose({
  focus: () => messageInput.value?.focus()
})
</script> 