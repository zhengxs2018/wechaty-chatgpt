// @ts-check

/**
 * 消息引用分隔符
 */
const REF_MSG_SEP = '<br/>- - - - - - - - - - - - - - -<br/>'

/**
 * 是否为文本消息
 *
 * @param {import('wechaty').Message} message 消息
 * @returns {boolean}
 */
export function isTextMessage(message) {
  return message.type() === message.wechaty.Message.Type.Text
}

/**
 * 获取自身被提及的文本
 *
 * @param {import('wechaty').Message} message 消息
 * @returns {string} 自身被提及的文本
 */
export function getMentionSelfText(message) {
  return `@${message.wechaty.currentUser.name()}`
}

/**
 * 移除消息中的引用内容
 *
 * @param {string} content 消息内容
 * @returns {string} 移除引用内容后的消息
 */
export function removeRef(content) {
  const index = content.indexOf(REF_MSG_SEP)
  return index > -1 ? content.split(REF_MSG_SEP)[1] : content
}

/**
 * 是否被提及
 *
 * @param {import('wechaty').Message} message 消息
 * @param {string} content 消息内容
 * @returns {Promise<boolean>} 是否被提及
 */
export async function hasMentionSelf(message, content) {
  if (await message.mentionSelf()) return true

  return content.indexOf(getMentionSelfText(message)) > -1
}

/**
 * 移除被提及的文本
 *
 * @param {import('wechaty').Message} message 消息
 * @param {string} content 消息内容
 * @returns {string} 移除被提及的文本后的消息
 */
export function removeMentionSelf(message, content) {
  const mentionSelfText = getMentionSelfText(message)

  return content.replace(mentionSelfText, '').trim()
}
