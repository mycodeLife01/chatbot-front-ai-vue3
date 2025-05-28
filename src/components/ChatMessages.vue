<template>
  <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messagesContainer">
    <!-- 欢迎消息 -->
    <WelcomeScreen 
      v-if="!chatStore.currentChat || chatStore.currentChat.messages.length === 0"
      @send-message="handleSendMessage"
    />

    <!-- 消息列表 -->
    <template v-else>
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
import { ref, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import WelcomeScreen from './WelcomeScreen.vue'
import MessageItem from './MessageItem.vue'
import LoadingIndicator from './LoadingIndicator.vue'

const chatStore = useChatStore()
const messagesContainer = ref(null)

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
  async () => {
    await nextTick()
    scrollToBottom()
  }
)

// 监听当前聊天变化，滚动到底部
watch(
  () => chatStore.currentChatId,
  async () => {
    await nextTick()
    scrollToBottom()
  }
)

defineExpose({
  scrollToBottom
})
</script> 