import type { Message } from 'wechaty'

import bot from '../services/wechaty.mjs'

/**
 * 清理消息中的特定内容
 *
 * @param text - 消息文本
 * @returns 清理后的消息文本
 */
export function cleanMessage(text: string) {
  return text.replace(`@${bot.currentUser.name()}`, '').trim()
}

/**
 * 回复消息
 *
 * @param message - 消息对象
 * @param text - 回复内容
 */
export function replyMessage(message: Message, text: string) {
  const room = message.room()

  if (room) {
    room.say(text, message.talker())
  } else {
    message.say(text)
  }
}
