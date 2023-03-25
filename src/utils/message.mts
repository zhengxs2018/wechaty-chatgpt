import type { Message } from 'wechaty'

import bot from '../services/wechaty.mjs'

/**
 * 引用消息分隔符
 */
const REF_MSG_SEP = '<br/>- - - - - - - - - - - - - - -<br/>'

/**
 * 是否为文本消息
 *
 * @param message - 聊天消息对象
 * @returns 是文本消息
 */
export function isTextMessage(message: Message) {
  return message.type() === bot.Message.Type.Text
}

/**
 * 清理引用的内容
 *
 * @param text
 */
function cleanRefMessage(text: string): string {
  const index = text.indexOf(REF_MSG_SEP)
  return index > -1 ? text.split(REF_MSG_SEP)[1] : text
}

/**
 * 获取提及我的文本
 *
 * @returns 提及我的文本
 */
function getMentionSelfText(): string {
  return `@${bot.currentUser.name()} `
}

/**
 * 清理消息中的提及我的文本
 *
 * @param text - 消息文本
 * @returns 处理后的消息内容
 */
function cleanMentionSelf(text: string): string {
  return text.replaceAll(getMentionSelfText(), '')
}

/**
 * 清理消息中的特定内容
 *
 * @param text - 消息文本
 * @returns 清理后的消息文本
 */
export function cleanMessage(text: string) {
  return cleanMentionSelf(cleanRefMessage(text)).trim()
}

/**
 * 是否有人群内提及或私聊我
 *
 * @param message - 聊天消息对象
 * @returns 提及或私聊
 */
export async function isMentionSelf(message: Message): Promise<boolean> {
  if (message.room()) {
    if (await message.mentionSelf()) return true

    // hack 微信 Web API 无法获取群内提及
    const text = cleanRefMessage(message.text())
    return text.indexOf(getMentionSelfText()) > -1
  }

  return true
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
