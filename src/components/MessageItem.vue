<template>
  <div class="chat-message">
    <!-- 用户消息 -->
    <div v-if="message.role === 'user'" class="flex justify-end mb-4">
      <div class="max-w-xs md:max-w-md lg:max-w-lg">
        <div class="bg-blue-600 text-white rounded-lg px-4 py-2 message-bubble">
          {{ message.content }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>

    <!-- AI消息 -->
    <div v-else class="flex justify-start mb-4">
      <div class="flex max-w-xs md:max-w-md lg:max-w-lg">
        <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <AIIcon class="w-4 h-4 text-white" />
        </div>
        <div>
          <div class="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg px-4 py-2 message-bubble">
            <span :class="message.isTyping ? 'typing-animation' : ''">
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
import { formatTime } from '@/utils/time'
import AIIcon from './icons/AIIcon.vue'

defineProps({
  message: {
    type: Object,
    required: true
  }
})
</script> 