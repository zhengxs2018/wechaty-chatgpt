import { Message } from 'wechaty'

import { isRobotReady, showHelp } from '../services/robot.mjs'
import wechaty from '../services/wechaty.mjs'
import { isMentionSelf, isTextMessage } from '../utils/is.mjs'
import { onChatGPT } from './on_chatgpt.mjs'

/**
 * 处理所有(含自身)的消息
 *
 * TODO: 其他功能待补充，如：搜歌
 *
 * @param message - 消息对象
 * @returns 空
 */
export async function onMessage(message: Message): Promise<void> {
  // 检查机器人是否准备好了
  if (isRobotReady(message) === false) return

  // TODO 暂不处理自身消息
  if (message.self()) return

  // TODO 暂不处理未提及机器人的消息
  if (!(await isMentionSelf(message))) return

  // 显示机器人菜单
  if (showHelp(message)) return

  // TODO 目前只支持文本消息
  if (!isTextMessage(message)) return

  // 响应群聊和私聊
  if (
    message.room() ||
    message.talker().type() === wechaty.Contact.Type.Individual
  ) {
    await onChatGPT(message)
  }
}