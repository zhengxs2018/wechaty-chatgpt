// @ts-check
import { log } from 'wechaty'

import {
  hasMentionSelf,
  removeMentionSelf,
  removeRef,
} from '../utils/message.mjs'
import { time } from '../utils/time.mjs'

/**
 * 处理房间消息
 *
 * @param {import('wechaty').Message} message
 * @param {import('../robot.mjs').RobotMessageHandler} handler
 */
export async function onRoom(message, handler) {
  const now = new Date()
  const receivedAt = message.date()

  const raw = removeRef(message.text())
  if (!(await hasMentionSelf(message, raw))) return

  /**
   * @type {import('wechaty').Room}
   */
  // @ts-ignore
  const room = message.room()
  const talker = message.talker()

  // 清理被提及的 @
  const content = removeMentionSelf(message, raw)

  const roomName = room.payload?.topic || '未知房间'

  /**
   * @type {import('../robot.mjs').RobotMessage}
   */
  const payload = {
    id: `${room.id}/${talker.id}`,
    user: talker.id,
    content,
    reply(sayable, done) {
      if (typeof sayable === 'string') {
        room.say(sayable, talker)
      } else {
        room.say(sayable)
        room.say(talker)
      }

      if (!done) return

      log.info(
        `🤖️ 在房间(${roomName})回复(${talker.name()})的消息 <-- ${time(
          now,
          new Date(),
        )}`,
      )
    },
  }

  log.info(
    `🤖️ 在房间(${roomName})收到(${talker.name()})的消息 --> ${time(
      receivedAt,
      now,
    )}`,
  )

  handler(payload, message)
}
