/**
 * 格式化时间显示
 * @param {Date|string|number} timestamp 时间戳
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (timestamp) => {
  if (!timestamp) {
    console.warn('时间戳为空')
    return '未知时间'
  }

  let date
  
  try {
    // 处理不同的时间格式
    if (timestamp instanceof Date) {
      date = timestamp
    } else if (typeof timestamp === 'string') {
      // 处理字符串时间格式
      date = new Date(timestamp)
    } else if (typeof timestamp === 'number') {
      // 处理数字时间戳，可能是秒或毫秒
      // 如果小于1000000000000 (2001年)，认为是秒级时间戳
      date = new Date(timestamp < 1000000000000 ? timestamp * 1000 : timestamp)
    } else {
      console.warn('无效的时间格式:', timestamp)
      return '无效时间'
    }

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      console.warn('无效的日期对象:', timestamp)
      return '无效时间'
    }

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
  } catch (error) {
    console.error('时间格式化错误:', error, '原始时间:', timestamp)
    return '时间错误'
  }
} 