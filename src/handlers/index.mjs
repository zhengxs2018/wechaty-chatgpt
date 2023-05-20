// @ts-check
import chat from './chat.mjs'
import drawing from './drawing.mjs'
import music from './music.mjs'

const handlers = [music, drawing, chat]

export function getMessageHandler(message) {
  return handlers.find(handler => handler.isMatch(message))
}
