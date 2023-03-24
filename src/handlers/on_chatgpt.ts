import { Message, log } from 'wechaty'

import chatGPT from '../services/chatgpt.mjs'
import sessionStore from '../services/store.mjs'
import { RENEW_CHATGPT_SESSION_COMMAND } from '../utils/constants.mjs'
import { cleanMessage, replyMessage } from '../utils/message.mjs'

/**
 * 与 ChatGPT 聊天
 *
 * TODO 如果是 markdown 格式的消息，转换为图片
 *
 * @param message  - 消息对象
 * @returns 空
 */
export async function onChatGPT(message: Message): Promise<void> {
  const room = message.room()
  const talker = message.talker()
  const isRoom = !!room
  const chatId = isRoom ? `${room.id}:${talker.id}` : `individual:${talker.id}`

  const text = cleanMessage(message.text())

  if (text === RENEW_CHATGPT_SESSION_COMMAND) {
    sessionStore.delete(chatId)
    replyMessage(message, '会话已经重新开始')
    return
  }

  const timer = setTimeout(() => {
    replyMessage(message, '我思考下 🤔')
  }, 2000)

  try {
    const res = await chatGPT.sendMessage(text, {
      parentMessageId: await sessionStore.get(chatId),
    })

    sessionStore.set(chatId, res.id)
    replyMessage(message, res.text)
    log.info('chatgpt reply', res.text)
  } catch (ex) {
    log.error(ex)
    replyMessage(message, '😭 人太多，聊不过来了')
  } finally {
    clearTimeout(timer)
  }
}
