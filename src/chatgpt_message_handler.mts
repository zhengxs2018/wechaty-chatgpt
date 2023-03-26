
import { ChatGPTAPI } from 'chatgpt'
import { LRUCache } from 'lru-cache'
import { Sayable, log } from 'wechaty'

import type { MessageListener } from './core/mod.mjs'

const code = `🤖 源码信息

仓库：https://github.com/zhengxs2018/wechaty-chatgpt
协议：MIT

👏 欢迎 Star 和 Fork。
`

const help = `🤖 使用说明

重制会话: /r, /reset
获取源码: /c, /code
获取帮助: /h, /help
`

export function chatgptMessageHandler(
  api: ChatGPTAPI,
): MessageListener {
  const cache = new LRUCache<string, string>({
    max: 500,
    ttl: 1000 * 60 * 5,
  })

  return async function handleMessage(
    id: string,
    text: string,
    reply: (sayable: Sayable) => void,
  ) {
    if (text === '/reset' || text === '/r') {
      cache.delete(id)

      reply('🤖️ 会话已重制')
      return
    }

    if (text === '/c' || text === '/code') {
      reply(code)
      return
    }

    if (text === '/help' || text === '/h') {
      reply(help)
      return
    }

    // 减少用户等待焦虑
    const timer = setTimeout(() => {
      reply('我思考下 🤔')
    }, 1000)

    try {
      const res = await api.sendMessage(text, {
        parentMessageId: cache.get(id),
      })

      clearTimeout(timer)
      cache.set(id, res.id)

      reply(res.text)
    } catch (ex) {
      clearTimeout(timer)
      log.error(ex)

      reply('😭 人太多，聊不过来了')
    }
  }
}
