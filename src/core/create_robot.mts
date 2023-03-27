import { WechatyOptions, log } from 'wechaty'

import { createWechaty } from './create_wechaty.mjs'
import type { MessageListener, Robot } from './interfaces.mjs'
import { processMessageFromIndividual } from './process_message_from_individual.mjs'
import { processMessageFromRoom } from './process_message_from_room.mjs'
import { processMessageFromRoot } from './process_message_from_root.mjs'

export function createRobot(options: WechatyOptions): Robot {
  let _isReady = true
  let _startupTime = Date.now()
  let _listener: MessageListener = () => void 0

  const wechaty = createWechaty(options)

  const bot: Robot = {
    heartbeat() {
      if (wechaty.isLoggedIn) {
        wechaty.say(`🤖 ${_isReady ? '服务已启动' : '服务已停止'}`)
      } else {
        log.error('🤖 机器人未登录')
      }
    },
    start() {
      if (_isReady) return

      _isReady = true
      _startupTime = Date.now()
      wechaty.say('🤖 服务已启动')
    },
    stop() {
      if (_isReady) {
        _isReady = false
        wechaty.say('🤖 服务已停止')
      }
    },
    async listen(messageHandler) {
      _listener = messageHandler

      log.info('🤖️ 正在启动微信...')
      await wechaty.start()
      log.info('🤖️ 正在登录到微信...')
    },
  }

  wechaty.on('message', message => {
    // hack 丢弃同步或延迟的消息
    if (message.date().getTime() < _startupTime) return

    if (message.self()) {
      processMessageFromRoot(bot, message)
      return
    }

    // 丢弃未启动的消息
    if (_isReady === false) return

    // 处理群消息
    const room = message.room()
    if (room) {
      processMessageFromRoom(room, message, (...args) => _listener(...args))
      return
    }

    // 只处理个人消息
    const talker = message.talker()
    if (talker.type() === wechaty.Contact.Type.Individual) {
      processMessageFromIndividual(talker, message, (...args) =>
        _listener(...args),
      )
      return
    }
  })

  return bot
}
