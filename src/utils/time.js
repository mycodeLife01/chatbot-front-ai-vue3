/**
 * 格式化时间显示
 * @param {Date} timestamp 时间戳
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  // 少于1分钟
  if (diff < 60000) return '刚刚'
  
  // 少于1小时
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  
  // 少于1天
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`

  // 超过1天
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
} 