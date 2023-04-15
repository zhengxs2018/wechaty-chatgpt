// @ts-check
import { log } from 'wechaty'

import { time } from '../utils/time.mjs'

/**
 * 处理私聊消息
 *
 * @param {import('wechaty').Message} message
 * @param {import('../robot.mjs').RobotMessageHandler} handler
 */
export function onFriend(message, handler) {
  const now = new Date()
  const talker = message.talker()
  const receivedAt = message.date()

  const talkerName = talker.payload?.name || '未知用户'

  /**
   * @type {import('../robot.mjs').RobotMessage}
   */
  const payload = {
    id: talker.id,
    user: talker.id,
    content: message.text(),
    async reply(sayable, done) {
      talker.say(sayable)

      if (!done) return

      log.info(`🤖️ 回复(${talkerName})的私聊 <-- ${time(now, new Date())}`)
    },
  }

  log.info(`🤖️ 收到(${talkerName})的私聊 --> ${time(receivedAt, now)}`)

  handler(payload, message)
}
