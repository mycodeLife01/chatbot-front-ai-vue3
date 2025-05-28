// 模拟AI回复延迟
const AI_RESPONSE_DELAY = () => 1000 + Math.random() * 2000

// AI回复模板
const AI_RESPONSES = [
  "这是一个很有趣的问题！让我来为您详细解答...",
  "根据您的描述，我建议您可以考虑以下几个方面：",
  "这个话题确实值得深入讨论。从我的角度来看...",
  "我理解您的需求，这里有几个可能的解决方案：",
  "非常好的问题！让我从不同的角度来分析一下..."
]

/**
 * 生成AI回复
 * @param {string} userMessage 用户消息
 * @returns {Promise<string>} AI回复内容
 */
export const generateAIResponse = async (userMessage) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, AI_RESPONSE_DELAY()))

  const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)]
  
  return randomResponse + 
    "\n\n基于您提到的内容，我认为这涉及到多个方面的考虑。如果您需要更具体的建议，请提供更多的详细信息，我会很乐意为您提供更精准的帮助。"
} 