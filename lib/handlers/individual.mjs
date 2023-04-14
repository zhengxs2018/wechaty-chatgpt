// @ts-check
import { log } from 'wechaty'

import { time } from '../shared/time.mjs'

/**
 * @param {import('wechaty').Message} message
 * @param {Function} handler
 * @returns {Promise<void>}
 */
export async function handleIndividualMessage(message, handler) {
  const now = new Date()

  const receivedAt = message.date()
  const talker = message.talker()

  log.info(`🤖️ 收到(${talker.name()})的私聊 --> ${time(receivedAt, now)}`)

  const reply = (sayable, done) => {
    if (typeof sayable === 'string') {
      talker.say(sayable)
    } else {
      talker.say(sayable)
      talker.say(talker)
    }

    if (!done) return

    log.info(`🤖️ 回复(${talker.name()})的私聊 <-- ${time(now, new Date())}`)
  }

  handler({
    id: talker.id,
    user: talker.id,
    content: message.text(),
    reply,
  })
}
