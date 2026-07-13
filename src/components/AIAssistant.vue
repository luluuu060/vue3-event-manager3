<script setup>
/**
 * AI 智能助手组件
 * 提供聊天对话界面，支持快捷问题和实时对话
 */
import { ref, nextTick, onMounted } from 'vue'
import { ArrowRightBold, ChatDotRound } from '@element-plus/icons-vue'
import { aiChatStreamService } from '@/api/ai'

const messages = ref([{ role: 'bot', content: '你好！我是智能助手，有什么可以帮你的吗？' }])
const inputMessage = ref('')
const isLoading = ref(false)
const isTyping = ref(false)
const showDialog = ref(false)
const chatContainer = ref(null)

const allQuickQuestions = [
  '你好你好',
  '前端分类的方法',
  '帮我写一篇前端文章大纲',
  '如何发布文章',
  '文章管理有哪些功能',
  '用户设置在哪里',
  '怎么修改密码',
  '如何上传头像',
  '文章封面怎么设置',
  '帮我写一篇技术博客'
]
const quickQuestions = ref([])

const shuffleQuestions = () => {
  const shuffled = [...allQuickQuestions].sort(() => Math.random() - 0.5)
  quickQuestions.value = shuffled.slice(0, Math.floor(Math.random() * 2) + 3)
}

const openDialog = () => {
  shuffleQuestions()
  showDialog.value = true
}

const handleQuickQuestion = (q) => {
  inputMessage.value = q
  sendMessage()
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight
}

const sendMessage = async () => {
  const message = inputMessage.value.trim()
  if (!message || isLoading.value || isTyping.value) return
  messages.value.push({ role: 'user', content: message })
  inputMessage.value = ''
  isLoading.value = true
  messages.value.push({ role: 'bot', content: '' })
  // 取回响应式代理对象，确保修改能触发视图更新
  const botMsg = messages.value[messages.value.length - 1]
  scrollToBottom()
  try {
    let firstChunk = true
    await aiChatStreamService(message, (chunk) => {
      if (firstChunk) {
        isLoading.value = false
        isTyping.value = true
        firstChunk = false
      }
      botMsg.content += chunk
      scrollToBottom()
    })
    isTyping.value = false
    if (!botMsg.content) {
      botMsg.content = '抱歉，我暂时无法回答这个问题。'
    }
  } catch {
    botMsg.content = '网络连接异常，请稍后再试。'
    isLoading.value = false
    isTyping.value = false
    scrollToBottom()
  }
}

onMounted(() => scrollToBottom())
</script>

<template>
  <!-- AI智能助手组件 -->
  <div class="ai-assistant">
    <!-- 悬浮按钮：点击打开对话框 -->
    <el-button class="float-btn" round type="primary" size="large" @click="openDialog">
      <el-icon><ChatDotRound /></el-icon>
    </el-button>

    <!-- AI对话弹窗 -->
    <el-dialog
      v-model="showDialog"
      title="AI 智能助手"
      width="500px"
      :close-on-click-modal="false"
      :append-to-body="false"
      class="ai-dialog"
    >
      <div class="dialog-content">
        <!-- 聊天消息列表 -->
        <div class="chat-messages" ref="chatContainer">
          <div v-for="(msg, index) in messages" :key="index" :class="['message-item', msg.role]">
            <div class="message-bubble">{{ msg.content }}</div>
          </div>
          <!-- 加载动画 -->
          <div v-if="isLoading" class="loading"><span></span><span></span><span></span></div>
        </div>

        <!-- 快捷问题标签 -->
        <div class="quick-questions">
          <span
            v-for="(q, index) in quickQuestions"
            :key="index"
            class="quick-item"
            @click="handleQuickQuestion(q)"
            >{{ q }}</span
          >
        </div>

        <!-- 输入框区域 -->
        <div class="chat-input">
          <div class="input-wrapper">
            <el-input
              v-model="inputMessage"
              placeholder="输入问题..."
              :disabled="isLoading || isTyping"
              @keydown.enter="sendMessage"
            />
            <!-- 发送按钮 -->
            <el-button
              class="send-btn"
              type="primary"
              :disabled="!inputMessage.trim() || isLoading || isTyping"
              @click="sendMessage"
            >
              <el-icon><ArrowRightBold /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
/* ===== AI智能助手组件样式 ===== */
.ai-assistant {
  .float-btn {
    position: fixed;
    right: 40px;
    bottom: 180px;
    width: 56px;
    height: 56px;
    font-size: 22px;
    z-index: 9999;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    border: none;
    &:hover {
      transform: scale(1.1);
    }
  }
}

/* ===== 对话弹窗样式 ===== */
.ai-dialog {
  :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    border-bottom: none;
  }
  :deep(.el-dialog__title) {
    color: #fff;
  }
  :deep(.el-dialog__close) {
    color: rgba(255, 255, 255, 0.8);
  }
  :deep(.el-dialog__body) {
    padding: 0;
  }
  :deep(.el-dialog) {
    border: none !important;
    border-radius: 12px;
    overflow: hidden;
  }

  .dialog-content {
    height: 500px;
    display: flex;
    flex-direction: column;

    /* ===== 聊天消息列表 ===== */
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #f8fafc;

      .message-item {
        margin-bottom: 16px;

        &.user {
          text-align: right;
          .message-bubble {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: #fff;
            border-radius: 12px 4px 12px 12px;
            display: inline-block;
          }
        }

        &.bot {
          text-align: left;
          .message-bubble {
            background: #fff;
            color: #334155;
            border-radius: 4px 12px 12px 12px;
            border: 1px solid #e2e8f0;
            display: inline-block;
          }
        }

        .message-bubble {
          max-width: 75%;
          padding: 10px 14px;
          font-size: 14px;
          line-height: 1.6;
        }
      }

      .loading {
        display: flex;
        gap: 6px;
        justify-content: center;
        span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #cbd5e1;
          animation: loading 1.4s infinite ease-in-out both;
          &:nth-child(1) {
            animation-delay: -0.32s;
          }
          &:nth-child(2) {
            animation-delay: -0.16s;
          }
        }
      }
    }

    /* ===== 快捷问题标签 ===== */
    .quick-questions {
      padding: 8px 16px;
      background: #fff;
      border-top: 1px solid #f1f5f9;
      overflow-x: auto;
      white-space: nowrap;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
      .quick-item {
        display: inline-block;
        padding: 6px 12px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        font-size: 12px;
        color: #334155;
        cursor: pointer;
        margin-right: 8px;
        margin-bottom: 4px;
        &:hover {
          border-color: #3b82f6;
        }
      }
    }

    /* ===== 输入框区域 ===== */
    .chat-input {
      padding: 12px 16px;
      border-top: 1px solid #e2e8f0;

      .input-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #fff;
        border-radius: 24px;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
        padding: 4px;
        padding-right: 8px;
      }

      :deep(.el-input) {
        flex: 1;
      }

      :deep(.el-input__wrapper) {
        border: none !important;
        border-radius: 20px !important;
        box-shadow: none !important;
        background: transparent !important;
        padding: 0 12px !important;
        --el-input-border-color: transparent !important;
        --el-input-focus-border-color: transparent !important;
      }

      :deep(.el-button.send-btn) {
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        width: 36px;
        height: 36px;
        padding: 0;
        margin: 0;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          transform: scale(1.1);
        }
        span {
          color: #fff;
        }
        svg {
          fill: #fff;
        }
      }
    }
  }
}

@keyframes loading {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
