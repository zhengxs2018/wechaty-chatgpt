import { Message } from 'wechaty'

import bot from '../services/wechaty.mjs'
import { cleanMessage } from './message.mjs'

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
 * 是否有人群内提及或私聊我
 *
 * @param message - 聊天消息对象
 * @returns 提及或私聊
 */
export async function isMentionSelf(message: Message): Promise<boolean> {
  if (message.room()) {
    if (await message.mentionSelf()) return true

    // hack 微信 Web API 无法获取群内提及
    const name = bot.currentUser.name()
    return message.text().indexOf(`@${name}`) > -1
  }

  return true
}

/**
 * 是否匹配指令
 *
 * @param message - 聊天消息对象
 * @param cmd - 指令
 * @returns 指令匹配
 */
export function isMatchCommand(message: Message, cmd: string): boolean {
  return isTextMessage(message) && cleanMessage(message.text()) === cmd
}
