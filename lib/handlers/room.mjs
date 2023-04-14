// @ts-check

import { log } from 'wechaty'

import { time } from '../shared/time.mjs'
import { hasMentionSelf, removeMentionSelf, removeRef } from '../shared/utils.mjs'

/**
 * @param {import('wechaty').Message} message
 * @param {Function} handler
 * @returns {Promise<void>}
 */
export async function handleRoomMessage(message, handler) {
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

  const content = removeMentionSelf(message, raw)

  const reply = (sayable, done) => {
    if (typeof sayable === 'string') {
      room.say(sayable, talker)
    } else {
      room.say(sayable)
      room.say(talker)
    }

    if (!done) return

    log.info(
      `🤖️ 在房间(${
        room.payload?.topic
      })回复(${talker.name()})的消息 <-- ${time(now, new Date())}`,
    )
  }

  log.info(
    `🤖️ 在房间(${room.payload?.topic})收到(${talker.name()})的消息 --> ${time(
      receivedAt,
      now,
    )}`,
  )

  handler({
    id: `${room.id}/${talker.id}`,
    user: talker.id,
    content,
    reply,
  })
}
