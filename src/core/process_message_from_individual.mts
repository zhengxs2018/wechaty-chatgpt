import type { Contact, Message, Sayable } from 'wechaty'

import type { MessageHandler } from './interfaces.mjs'

export async function processMessageFromIndividual(
  talker: Contact,
  message: Message,
  handler: MessageHandler
) {
  const text = message.text().trim()

  const reply = (sayable: Sayable) => {
    if (typeof sayable === 'string') {
      talker.say(sayable)
    } else {
      talker.say(sayable)
      talker.say(talker)
    }
  }

  handler(talker.id, text, reply)
}
