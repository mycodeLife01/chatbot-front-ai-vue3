<template>
  <div class="p-4 bg-white dark:bg-dark-card rounded-lg border">
    <h3 class="text-lg font-bold mb-4">Markdown渲染测试</h3>
    
    <div class="markdown-content" v-html="testMarkdown"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

const markdownText = `
# 标题1
## 标题2
### 标题3

这是一个**粗体文本**和*斜体文本*的示例。

- 列表项1
- 列表项2
- 列表项3

1. 有序列表1
2. 有序列表2
3. 有序列表3

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
  return "success";
}
\`\`\`

这是一个\`内联代码\`示例。

> 这是一个引用块
> 多行引用

[链接示例](https://example.com)

| 表头1 | 表头2 | 表头3 |
|-------|-------|-------|
| 单元格1 | 单元格2 | 单元格3 |
| 单元格4 | 单元格5 | 单元格6 |
`

const testMarkdown = computed(() => {
  return renderMarkdown(markdownText)
})
</script> 