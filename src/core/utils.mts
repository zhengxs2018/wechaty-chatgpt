import type { Message } from 'wechaty'

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
  return message.type() === message.wechaty.Message.Type.Text
}

/**
 * 清理引用的消息内容
 *
 * @param text
 */
export function removeRef(text: string): string {
  const index = text.indexOf(REF_MSG_SEP)
  return index > -1 ? text.split(REF_MSG_SEP)[1] : text
}

export async function hasMentionSelf(
  message: Message,
  text: string,
): Promise<boolean> {
  if (await message.mentionSelf()) return true

  // hack 修复无法识别被提及的问题
  return text.indexOf(`@${message.wechaty.currentUser.name()}`) > -1
}

export function removeMentionSelf(message: Message, text: string): string {
  const mentionSelfText = `@${message.wechaty.currentUser.name()}`
  return text.replace(mentionSelfText, '').trim()
}
