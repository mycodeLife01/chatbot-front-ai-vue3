<template>
  <div class="chat-message">
    <!-- 用户消息 -->
    <div v-if="message.role === 'user'" class="flex justify-end mb-3">
      <div class="max-w-xs md:max-w-md lg:max-w-lg">
        <div class="bg-blue-600 text-white rounded-lg px-3 py-2 message-bubble">
          {{ message.content }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>

    <!-- AI消息 -->
    <div v-else class="flex justify-start mb-3">
      <div class="flex max-w-xs md:max-w-md lg:max-w-lg">
        <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <AIIcon class="w-4 h-4 text-white" />
        </div>
        <div>
          <div class="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg px-3 py-2 message-bubble">
            <div 
              v-if="!message.isTyping"
              class="markdown-content"
              v-html="renderedContent"
            ></div>
            <span v-else :class="message.isTyping ? 'typing-animation' : ''">
              {{ message.content }}
            </span>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatTime } from '@/utils/time'
import { renderMarkdown } from '@/utils/markdown'
import AIIcon from './icons/AIIcon.vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

// 计算渲染后的Markdown内容
const renderedContent = computed(() => {
  if (props.message.role === 'assistant' && !props.message.isTyping) {
    const content = props.message.content
    
    // 确保内容是字符串
    if (typeof content !== 'string') {
      console.error('消息内容不是字符串:', content, typeof content)
      return String(content || '内容格式错误')
    }
    
    return renderMarkdown(content)
  }
  return props.message.content
})
</script> 