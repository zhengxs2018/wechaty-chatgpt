import { Message, log } from 'wechaty'

import { RENEW_CHATGPT_SESSION_COMMAND } from '../utils/constants.mjs'
import { isMatchCommand } from '../utils/is.mjs'

/**
 * 机器人是否启动
 *
 * 微信启动会同步最近消息
 * 导致机器人一次性发送大量消息
 * 这对使用非常不友好
 */
let isReady = false

/**
 * 是否应该启动机器人
 *
 * @param message - 消息对象
 * @returns 空
 */
export function isRobotReady(message: Message): boolean {
  // hack 防止过时的消息触发机器人的启动
  if (message.age() > 60) return isReady

  if (isReady) {
    if (isMatchCommand(message, '关闭')) {
      isReady = false

      message.say('🤖 聊天机器人已停止')
      log.info('聊天机器人关闭')
    }
  } else {
    if (isMatchCommand(message, '启动')) {
      isReady = true

      message.say('🤖 聊天机器人已启动')
      log.info('聊天机器人启动')
    }
  }

  return isReady
}

const help = `功能菜单:

1. 发送「${RENEW_CHATGPT_SESSION_COMMAND}」，开启新会话
2. 发送「菜单」，获取帮助菜单

在群内使用时，通过 @机器人 触发。
`

export function showHelp(message: Message): boolean | void {
  if (isMatchCommand(message, '菜单')) {
    message.say(help)
    return true
  }
}
