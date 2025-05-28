<template>
  <div class="flex justify-start mb-4">
    <div class="flex max-w-xs md:max-w-md lg:max-w-lg">
      <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
        <SpinnerIcon class="w-4 h-4 text-white" />
      </div>
      <div class="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg px-4 py-2">
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SpinnerIcon from './icons/SpinnerIcon.vue'
</script> 