import { Message } from 'wechaty'

import { cleanMessage, isTextMessage } from './message.mjs'

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
