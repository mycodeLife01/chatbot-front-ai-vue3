<template>
  <div class="flex-1 overflow-y-auto p-4 space-y-2" ref="messagesContainer">
    <!-- 欢迎消息 -->
    <WelcomeScreen 
      v-if="!chatStore.currentChat || chatStore.currentChat.messages.length === 0"
      @send-message="handleSendMessage"
    />

    <!-- 消息列表 -->
    <template v-else>
      <!-- 调试模式：显示最后几条消息的详细信息 -->
      <div v-if="showDebug">
        <DebugMessage
          v-for="message in chatStore.currentChat.messages.slice(-3)"
          :key="'debug-' + message.id"
          :message="message"
        />
      </div>
      
      <MessageItem
        v-for="message in chatStore.currentChat.messages"
        :key="message.id"
        :message="message"
      />
    </template>

    <!-- 加载指示器 -->
    <LoadingIndicator v-if="chatStore.isLoading" />
  </div>
</template>

<script setup>
import { ref, nextTick, watch, watchEffect } from 'vue'
import { useChatStore } from '@/stores/chat'
import WelcomeScreen from './WelcomeScreen.vue'
import MessageItem from './MessageItem.vue'
import LoadingIndicator from './LoadingIndicator.vue'
import DebugMessage from './DebugMessage.vue'

const chatStore = useChatStore()
const messagesContainer = ref(null)
const showDebug = ref(false) // 关闭调试模式

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleSendMessage = async (message) => {
  await chatStore.sendMessage(message)
  await nextTick()
  scrollToBottom()
}

// 监听消息变化，自动滚动到底部
watch(
  () => chatStore.currentChat?.messages?.length,
  async (newLength, oldLength) => {
    console.log('ChatMessages: 消息数量变化', { oldLength, newLength })
    await nextTick()
    scrollToBottom()
  }
)

// 监听当前聊天变化，滚动到底部
watch(
  () => chatStore.currentChatId,
  async (newId, oldId) => {
    console.log('ChatMessages: 聊天ID变化', { oldId, newId })
    await nextTick()
    scrollToBottom()
  }
)

// 监听整个消息数组的变化
watch(
  () => chatStore.currentChat?.messages,
  (newMessages) => {
    console.log('ChatMessages: 消息数组变化', newMessages?.length || 0)
  },
  { deep: true }
)

// 使用watchEffect来监听所有相关状态
watchEffect(() => {
  if (chatStore.currentChat?.messages) {
    console.log('ChatMessages: watchEffect 触发，当前消息数量:', chatStore.currentChat.messages.length)
  }
})

defineExpose({
  scrollToBottom
})
</script> 