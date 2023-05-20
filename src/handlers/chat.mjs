// @ts-check
import crypto from 'node:crypto'

import { defineMessageHandler } from '@zhengxs/easybot'
import { ChatGPTError } from 'chatgpt'

import api from '../shared/chatgpt.mjs'

export default defineMessageHandler(async ({ message, state, signal }) => {
  const createConversationContext = () => {
    if (!state.chatgpt) {
      state.chatgpt = {
        conversationId: crypto.randomUUID(),
      }
    }
    return state.chatgpt
  }

  const conversationContext = createConversationContext()

  // 如果时间超过8秒，就提示一下
  const timer = setTimeout(() => {
    message.reply('[ChatGPT] ⌛️ 还在思考中...')
  }, 8000)

  try {
    const res = await api.sendMessage(message.content, {
      conversationId: conversationContext.conversationId,
      parentMessageId: conversationContext.parentMessageId,
      timeoutMs: 5 * 60 * 1000,
      abortSignal: signal,
    })

    clearTimeout(timer)

    if (signal.aborted) return

    conversationContext.parentMessageId = res.id

    await message.reply(res.text)
  } catch (ex) {
    clearTimeout(timer)

    if (signal.aborted) return

    if (ex instanceof ChatGPTError) {
      if (ex.statusCode === 401 || ex.statusCode === 404) {
        await message.reply('[ChatGPT] 😭 模型不让用了')
        return
      }

      if (ex.statusCode === 429) {
        await message.reply('[ChatGPT] 😭 人太多，聊不过来了')
        return
      }

      if (ex.statusCode === 500) {
        await message.reply('[ChatGPT] 😭 聊崩了，等会再试试')
        return
      }
    }

    console.error(`ERROR [chatgpt] :${ex.message}`)
    await message.reply('[ChatGPT] 😭 想说点什么，但是没想好')
  }
})
