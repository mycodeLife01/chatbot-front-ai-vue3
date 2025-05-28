<template>
  <div class="flex flex-col items-center justify-center h-full text-center">
    <div class="mb-8">
      <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
        <ChatIcon class="w-8 h-8 text-white" />
      </div>
      <h2 class="text-2xl font-bold gradient-text mb-2">欢迎使用AI助手</h2>
      <p class="text-gray-600 dark:text-gray-400 max-w-md">
        我是您的AI助手，可以帮助您解答问题、提供建议和进行对话。请输入您的问题开始聊天！
      </p>
    </div>

    <!-- 示例问题 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
      <button 
        v-for="example in exampleQuestions" 
        :key="example"
        @click="$emit('send-message', example)"
        class="p-4 text-left bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600">
        <p class="text-sm font-medium">{{ example }}</p>
      </button>
    </div>
  </div>
</template>

<script setup>
import ChatIcon from './icons/ChatIcon.vue'

const exampleQuestions = [
  "你好，你能帮我做什么？",
  "请介绍一下人工智能的发展历程",
  "帮我写一个简单的Python程序",
  "什么是机器学习？"
]

defineEmits(['send-message'])
</script> 