<template>
  <div class="debug-message bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg mb-4 border border-yellow-300">
    <h4 class="font-bold text-yellow-800 dark:text-yellow-200 mb-2">调试信息 - 消息 ID: {{ message.id }}</h4>
    
    <div class="text-sm space-y-2">
      <div>
        <strong>角色:</strong> {{ message.role }}
      </div>
      
      <div>
        <strong>内容类型:</strong> {{ typeof message.content }}
      </div>
      
      <div>
        <strong>内容长度:</strong> {{ message.content ? message.content.length : 'null' }}
      </div>
      
      <div>
        <strong>原始内容:</strong>
        <pre class="bg-gray-200 dark:bg-gray-700 p-2 rounded mt-1 text-xs">{{ JSON.stringify(message.content, null, 2) }}</pre>
      </div>
      
      <div>
        <strong>完整消息对象:</strong>
        <pre class="bg-gray-200 dark:bg-gray-700 p-2 rounded mt-1 text-xs">{{ JSON.stringify(message, null, 2) }}</pre>
      </div>
      
      <div v-if="message.role === 'assistant'">
        <strong>Markdown渲染结果:</strong>
        <div class="bg-gray-200 dark:bg-gray-700 p-2 rounded mt-1" v-html="debugRender"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const debugRender = computed(() => {
  if (props.message.role === 'assistant') {
    try {
      return renderMarkdown(props.message.content)
    } catch (error) {
      return `渲染错误: ${error.message}`
    }
  }
  return '用户消息不渲染Markdown'
})
</script> 