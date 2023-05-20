// @ts-check

/**
 * 消息引用分隔符
 */
const REF_MSG_SEP = '- - - - - - - - - - - - - - -'

/**
 * 移除消息中的引用内容
 *
 * @param {string} text 消息内容
 * @returns {string} 移除引用内容后的消息
 */
export function removeQuoteContent(text) {
  const index = text.indexOf(REF_MSG_SEP)
  return index > -1 ? text.split(REF_MSG_SEP)[1] : text
}
