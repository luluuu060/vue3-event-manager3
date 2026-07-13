const API_URL = import.meta.env.VITE_AI_API_URL
const API_KEY = import.meta.env.VITE_AI_API_KEY
const MODEL = import.meta.env.VITE_AI_MODEL

const mockResponses = {
  你好: '你好！我是 AI 智能助手，很高兴为你服务。',
  文章: '你可以在文章管理中创建、编辑和删除文章。首先需要选择文章分类，然后填写标题、上传封面并编写内容。',
  分类: '文章分类帮助你组织和管理内容。你可以在文章分类页面添加、编辑和删除分类。',
  帮助: '你可以问我关于文章管理、用户设置等方面的问题，我会尽力为你解答。',
  登录: '请使用注册时的用户名和密码登录系统。如果忘记密码，可以联系管理员重置。',
  注册: '点击注册按钮，填写用户名（5-10位）和密码（6-12位字母或数字）即可完成注册。'
}

const defaultResponses = [
  '这个问题我还在学习中，稍后再试试吧！',
  '抱歉，我暂时无法回答这个问题。',
  '你可以问我关于文章管理或用户设置的问题。',
  '很高兴为你服务，但这个问题我不太清楚。'
]

const getMockResponse = (message) => {
  for (const [key, value] of Object.entries(mockResponses)) {
    if (message.includes(key)) {
      return value
    }
  }
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

export const aiChatService = async (message) => {
  if (!API_URL || !API_KEY) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            message: getMockResponse(message)
          }
        })
      }, 800 + Math.random() * 700)
    })
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              '你是一个专业的内容管理系统助手，名为 Big Event。请用简洁友好的语言回答用户的问题。'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7
      })
    })

    const data = await response.json()

    if (response.ok && data.choices && data.choices[0]) {
      return {
        data: {
          message: data.choices[0].message.content
        }
      }
    } else {
      throw new Error(data.error?.message || 'API调用失败')
    }
  } catch {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            message: getMockResponse(message)
          }
        })
      }, 800 + Math.random() * 700)
    })
  }
}

/**
 * AI 流式对话服务（逐字输出效果）
 * @param {string} message - 用户提问内容
 * @param {Function} onChunk - 每收到一个字符时的回调函数
 * @returns {Promise} - 流式输出完成后resolve
 *
 * 工作流程：
 * 1. Mock模式：将完整回答按字符逐字输出，模拟打字机效果
 * 2. 真实API模式：暂未实现，回退到Mock模式
 */
export const aiChatStreamService = async (message, onChunk) => {
  // 获取完整回答内容
  let fullAnswer = ''

  // Mock模式：未配置真实API时使用
  if (!API_URL || !API_KEY) {
    fullAnswer = getMockResponse(message)
  } else {
    // 真实API暂不支持流式，回退到Mock模式
    try {
      const res = await aiChatService(message)
      fullAnswer = res.data.message
    } catch {
      fullAnswer = '网络连接异常，请稍后再试。'
    }
  }

  // 模拟逐字输出（打字机效果）
  for (let i = 0; i < fullAnswer.length; i++) {
    // 每个字符延迟 30-80ms，模拟打字速度
    await new Promise((resolve) => setTimeout(resolve, 30 + Math.random() * 50))
    onChunk(fullAnswer[i])
  }
}
