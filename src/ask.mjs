// @ts-check
import * as bot from '@zhengxs/easybot'

import { getMessageHandler } from './handlers/index.mjs'
import { clearUserState, createUserState } from './state.mjs'

const helpText = `🤖️ 这是帮助信息。

内置指令:

- 点歌: 播放2002年的第一场雪
- 视频: 播放青花瓷mv
- 画图: 画一条鲸鱼
- 重置: 重新开始
- 帮助: 帮助

提示: 会话按人隔离, 操作和消息不互通。
`

/**
 * @param {bot.OutgoingMessage} message
 */
export async function ask(message) {
  // 不支持文本以外的消息
  if (message.type !== message.wechaty.Message.Type.Text) return

  const userId = message.talker.id
  const state = createUserState(userId)

  // 允许强制停止当前活动
  if (message.content === '帮助') {
    return message.reply(helpText)
  }

  // 允许强制停止当前活动
  if (message.content === '重新开始') {
    if (state.abortController) {
      state.abortController.abort('重新开始')
    }

    clearUserState(userId)

    return message.reply('🤖️ 好的，重新开始聊天吧')
  }

  // 如果有活动，不允许重复请求
  if (state.abortController) {
    return message.reply('🤖️ 你的上一个请求还没处理完呢')
  }

  try {
    const abortController = new AbortController()

    state.abortController = abortController

    const messageHandler = getMessageHandler(message)
    if (messageHandler) {
      await messageHandler.postMessage({
        state,
        message,
        signal: abortController.signal,
      })
    } else {
      await message.reply('🤖️ 我不知道你在说什么')
    }
  } finally {
    state.abortController = null
  }
}
