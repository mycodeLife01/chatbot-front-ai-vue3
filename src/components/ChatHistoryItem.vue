<template>
  <div 
    @click="$emit('select', chat.id)"
    class="p-3 rounded-lg mb-2 cursor-pointer transition-colors duration-200 group"
    :class="isActive ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-dark-border'">
    
    <div class="flex items-center justify-between">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium truncate">{{ chat.title }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ formatTime(chat.lastMessage) }}
        </p>
      </div>
      <button 
        @click.stop="showDeleteDialog = true"
        class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200">
        <DeleteIcon class="w-4 h-4" />
      </button>
    </div>
  </div>

  <!-- 删除确认对话框 -->
  <ConfirmDialog
    v-model:visible="showDeleteDialog"
    title="删除对话"
    message="确定要删除这个对话吗？删除后将无法恢复。"
    confirm-text="删除"
    cancel-text="取消"
    @confirm="handleDelete"
  />
</template>

<script setup>
import { ref } from 'vue'
import { formatTime } from '@/utils/time'
import DeleteIcon from './icons/DeleteIcon.vue'
import ConfirmDialog from './ConfirmDialog.vue'

const props = defineProps({
  chat: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'delete'])

const showDeleteDialog = ref(false)

const handleDelete = () => {
  emit('delete', props.chat.id)
  showDeleteDialog.value = false
}
</script> 