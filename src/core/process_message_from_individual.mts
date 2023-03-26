import type { Contact, Message, Sayable } from 'wechaty'

import type { MessageListener } from './interfaces.mjs'

export async function processMessageFromIndividual(
  talker: Contact,
  message: Message,
  listener: MessageListener
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

  listener(talker.id, text, reply)
}
