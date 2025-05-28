<template>
  <!-- 遮罩层 -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        @click="handleBackdropClick">
        
        <!-- 对话框 -->
        <div
          class="bg-white dark:bg-dark-card rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all"
          @click.stop>
          
          <!-- 对话框头部 -->
          <div class="p-6 pb-4">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-3">
                <WarningIcon class="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ title }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ message }}
            </p>
          </div>
          
          <!-- 对话框底部按钮 -->
          <div class="px-6 py-4 bg-gray-50 dark:bg-dark-border/30 rounded-b-lg flex justify-end space-x-3">
            <button
              @click="handleCancel"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border transition-colors duration-200 font-medium">
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import WarningIcon from './icons/WarningIcon.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '确认操作'
  },
  message: {
    type: String,
    default: '您确定要执行此操作吗？'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
})

const emit = defineEmits(['confirm', 'cancel', 'update:visible'])

const handleConfirm = () => {
  emit('confirm')
  emit('update:visible', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}

const handleBackdropClick = () => {
  handleCancel()
}

// 监听ESC键关闭对话框
watch(() => props.visible, (newVisible) => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (newVisible) {
    document.addEventListener('keydown', handleEscape)
    // 防止页面滚动
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .transform,
.modal-leave-active .transform {
  transition: transform 0.3s ease;
}

.modal-enter-from .transform,
.modal-leave-to .transform {
  transform: scale(0.9) translateY(-10px);
}
</style> 