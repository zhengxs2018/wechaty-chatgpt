import type { Message, Room, Sayable } from 'wechaty'

import type { MessageListener } from './interfaces.mjs'
import {
  hasMentionSelf,
  isTextMessage,
  removeMentionSelf,
  removeRef,
} from './utils.mjs'

export async function processMessageFromRoom(
  room: Room,
  message: Message,
  listener: MessageListener,
) {
  // TODO: 支持其他类型的消息
  if (isTextMessage(message) === false) return

  // hack 防止被引用的消息中存在被提及
  const raw = removeRef(message.text())

  // 只有被提及的消息才回应
  if (!(await hasMentionSelf(message, raw))) return

  const talker = message.talker()
  const reply = (sayable: Sayable) => {
    if (typeof sayable === 'string') {
      room.say(sayable, talker)
    } else {
      room.say(sayable)
      room.say(talker)
    }
  }

  const text = removeMentionSelf(message, raw)
  listener(`${room.id}/${talker.id}`, text, reply)
}
