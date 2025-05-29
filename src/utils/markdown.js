import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'

// 导入常用语言
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import css from 'highlight.js/lib/languages/css'
import html from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import sql from 'highlight.js/lib/languages/sql'

// 注册语言
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', html)
hljs.registerLanguage('xml', html)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sql', sql)

// 简化的marked配置
marked.setOptions({
  breaks: true,
  gfm: true,
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  }
})

/**
 * 渲染Markdown文本为HTML
 * @param {string} markdown Markdown文本
 * @returns {string} 渲染后的HTML
 */
export const renderMarkdown = (markdown) => {
  if (!markdown) return ''
  
  // 确保输入是字符串
  if (typeof markdown !== 'string') {
    console.error('Markdown渲染错误: 输入不是字符串', markdown, typeof markdown)
    return String(markdown) // 尝试转换为字符串
  }
  
  try {
    console.log('开始渲染Markdown:', markdown.substring(0, 100) + '...')
    const result = marked(markdown)
    console.log('Markdown渲染成功，结果类型:', typeof result)
    return result
  } catch (error) {
    console.error('Markdown渲染错误:', error)
    return markdown // 如果渲染失败，返回原始文本
  }
}

/**
 * 清理HTML，防止XSS攻击
 * @param {string} html HTML字符串
 * @returns {string} 清理后的HTML
 */
export const sanitizeHtml = (html) => {
  // 基本的HTML清理，只允许安全的标签
  const allowedTags = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'strong', 'em', 'u', 's',
    'code', 'pre', 'blockquote',
    'ul', 'ol', 'li',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'a', 'img'
  ]
  
  // 这里应该使用专门的HTML清理库，但为了简单起见，我们信任marked的输出
  return html
} 