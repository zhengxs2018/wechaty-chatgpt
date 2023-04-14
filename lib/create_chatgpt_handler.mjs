// @ts-check
import { ChatGPTError } from 'chatgpt'
import QuickLRU from 'quick-lru'

const help = `🤖 使用说明

重置会话: /r
获取帮助: /h
`

export function createChatgptHandler(api) {
  // 用于记录上一次的会话ID
  const chats = new QuickLRU({
    maxSize: 999,
    maxAge: 1000 * 60 * 5,
  })

  // 防止 API 请求频率过高
  const limiter = new QuickLRU({
    maxSize: 999,
    maxAge: 1000 * 60 * 5,
  })

  async function sendMessage({ id, user, content, reply }) {
    // 如果已经在等待回复了，就不要再发请求了
    if (limiter.get(id)) {
      reply('⌛️ 请稍等...')
      return
    }

    // 如果时间超过8秒，就提示一下
    const timer = setTimeout(() => {
      reply('⌛️ 还在思考中...')
    }, 8000)

    try {
      limiter.set(id, 'waiting')

      const res = await api.sendMessage(content, {
        conversationId: id,
        parentMessageId: chats.get(id),
        completionParams: { user },
        timeoutMs: 5 * 60 * 1000,
      })

      chats.set(id, res.id)
      reply(res.text, true)
    } catch (ex) {
      if (ex instanceof ChatGPTError) {
        if (ex.statusCode === 401 || ex.statusCode === 404) {
          reply('😭 模型不让用了', true)
          return
        }

        if (ex.statusCode === 429) {
          reply('😭 人太多，聊不过来了', true)
          return
        }

        if (ex.statusCode === 500) {
          reply('😭 聊崩了，等会再试试', true)
          return
        }
      }

      console.error(`ERROR [chatgpt] :${ex.message}`)
      reply('😭 想说点什么，但是没想好', true)
    } finally {
      clearTimeout(timer)
      limiter.delete(id)
    }
  }

  return async function messageHandler(message) {
    switch (message.content) {
      // 故意设计的重置会话，但不去除限制
      case '/r':
        chats.delete(message.id)
        message.reply('🤖️ 会话已重置', true)
        break
      case '/h':
        message.reply(help, true)
        break
      default:
        sendMessage(message)
    }
  }
}
