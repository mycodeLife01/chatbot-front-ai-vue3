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
            <!-- 流式输入中的状态 -->
            <div v-if="message.isStreaming" class="flex items-start">
              <div 
                class="markdown-content flex-1"
                v-html="renderedContent"
              ></div>
              <div class="typing-indicator ml-2 flex-shrink-0">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
              </div>
            </div>
            <!-- 正常显示状态 -->
            <div 
              v-else
              class="markdown-content"
              v-html="renderedContent"
            ></div>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
            {{ formatTime(message.timestamp) }}
            <!-- 流式状态指示 -->
            <span v-if="message.isStreaming" class="ml-2 text-green-500">
              正在输入...
            </span>
            <!-- 错误状态指示 -->
            <span v-if="message.isError" class="ml-2 text-red-500">
              回复失败
            </span>
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
  if (!props.message.content) return ''
  return renderMarkdown(props.message.content)
})
</script>

<style scoped>
.message-bubble {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* 打字机指示器样式 */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 2px;
}

.typing-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #9ca3af;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Markdown内容样式 */
.markdown-content {
  line-height: 1.6;
}

.markdown-content :deep(p) {
  margin: 0 0 0.5em 0;
}

.markdown-content :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-content :deep(code) {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.markdown-content :deep(pre) {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.5em;
  border-radius: 5px;
  overflow-x: auto;
  margin: 0.5em 0;
}

.markdown-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
}
</style> 