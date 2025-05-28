# AI聊天机器人 - Vue 3项目

一个基于Vue 3、Tailwind CSS和Pinia构建的现代化AI聊天机器人前端界面。

## ✨ 功能特性

### 🎨 界面设计
- 仿ChatGPT的现代极简设计
- 深色/浅色主题切换，支持系统偏好检测
- 完全响应式布局，完美适配移动端和桌面端
- 平滑动画过渡效果

### 💬 聊天功能
- 实时消息发送与接收
- 模拟AI回复（可扩展接入真实AI API）
- 消息时间戳显示
- 自动滚动到最新消息

### 📱 侧边栏功能
- 对话历史管理（新建、选择、删除）
- 桌面端侧边栏收起/展开功能
- 移动端滑动抽屉式侧边栏
- 智能对话标题生成

### 🔧 用户体验
- Enter发送消息，Shift+Enter换行
- 示例问题快速开始对话
- 移动端触摸友好设计
- 主题偏好本地存储

## 🚀 技术栈

- **框架**: Vue 3 (Composition API)
- **状态管理**: Pinia
- **样式**: Tailwind CSS
- **构建工具**: Vite
- **字体**: Inter

## 📁 项目结构

```
chatbot-vue3/
├── src/
│   ├── components/          # 组件目录
│   │   ├── icons/          # 图标组件
│   │   ├── ChatSidebar.vue # 侧边栏组件
│   │   ├── ChatHeader.vue  # 头部组件
│   │   ├── ChatMessages.vue # 消息区域组件
│   │   ├── ChatInput.vue   # 输入组件
│   │   ├── WelcomeScreen.vue # 欢迎页面组件
│   │   ├── MessageItem.vue # 消息项组件
│   │   ├── ChatHistoryItem.vue # 对话历史项组件
│   │   └── LoadingIndicator.vue # 加载指示器组件
│   ├── stores/             # Pinia状态管理
│   │   ├── chat.js        # 聊天相关状态
│   │   └── ui.js          # UI相关状态
│   ├── utils/             # 工具函数
│   │   ├── ai.js          # AI回复生成
│   │   └── time.js        # 时间格式化
│   ├── assets/
│   │   └── css/
│   │       └── index.css  # 全局样式
│   ├── App.vue            # 主应用组件
│   └── main.js            # 应用入口
├── index.html             # HTML模板
├── package.json           # 项目配置
├── vite.config.js         # Vite配置
├── tailwind.config.js     # Tailwind配置
└── postcss.config.js      # PostCSS配置
```

## 🛠️ 开发指南

### 安装依赖
```bash
cd chatbot-vue3
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 🎯 核心组件说明

### 状态管理 (Pinia)
- **ChatStore**: 管理聊天数据、消息历史、AI回复逻辑
- **UIStore**: 管理主题、侧边栏状态、响应式布局

### 组件架构
- **模块化设计**: 每个功能区域都是独立的Vue组件
- **组合式API**: 使用Vue 3的Composition API提高代码复用性
- **Props/Emits**: 清晰的组件通信模式

### 样式系统
- **Tailwind CSS**: 原子化CSS框架，高度可定制
- **深色模式**: 基于CSS类的主题切换
- **响应式**: 移动优先的响应式设计

## 🔧 自定义配置

### 修改AI回复逻辑
编辑 `src/utils/ai.js` 文件，可以：
- 接入真实的AI API（如OpenAI、Claude等）
- 修改回复模板
- 调整响应延迟

### 自定义主题
编辑 `tailwind.config.js` 和 `src/assets/css/index.css`：
- 修改颜色方案
- 调整动画效果
- 自定义字体

### 添加新功能
- 在 `src/components/` 中添加新组件
- 在 `src/stores/` 中扩展状态管理
- 在 `src/utils/` 中添加工具函数

## 📝 开发说明

这个项目从单文件HTML重构而来，保持了原有的所有功能，同时提升了：
- **代码组织**: 模块化的组件结构
- **可维护性**: 清晰的职责分离
- **可扩展性**: 易于添加新功能
- **类型安全**: 更好的开发体验

## 🌟 特色亮点

1. **完美移动端适配**: 修复了原版的移动端侧边栏bug
2. **优雅的动画**: 平滑的过渡和微交互
3. **智能主题**: 自动检测系统主题偏好
4. **高性能**: 基于Vue 3和Vite的现代化构建
5. **易于定制**: 高度模块化的架构设计 