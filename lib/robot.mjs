// @ts-check
import { WechatyBuilder, log } from 'wechaty'
import { QRCodeTerminal } from 'wechaty-plugin-contrib'

import { onFriend } from './events/on_friend.mjs'
import { onRoom } from './events/on_room.mjs'
import { onSelf } from './events/on_self.mjs'
import { isTextMessage } from './utils/message.mjs'

/**
 * @callback RobotReply
 * @param {import('wechaty').Sayable} sayable - 回复内容
 * @param {boolean} [done] - 是否结束回复
 * @returns {void}
 */

/**
 * @typedef {Object} RobotMessage
 * @property {string} id
 * @property {string} user
 * @property {string} content
 * @property {RobotReply} reply
 */

/**
 * @callback RobotMessageHandler
 * @param {RobotMessage} payload - 统一消息格式
 * @param {import('wechaty').Message} message - 原始消息
 */

/**
 * @callback RobotState
 * @param {boolean} running - 是否正在运行
 * @param {number} startupTime - 启动时间，每次重启都会更新
 */

/**
 * @typedef {Object} Robot
 * @param {() => void} status - 给自己发送一条消息，用于检查是否在线
 * @param {() => void} run - 启动服务
 * @param {() => void} stop - 停止服务
 * @param {() => Promise<void>} listen - 监听消息
 */

/**
 * 创建聊天机器人
 *
 * @param {import('wechaty').WechatyOptions} options
 * @param {RobotMessageHandler} handler
 * @returns {Robot}
 */
export function createRobot(options, handler) {
  const wechaty = WechatyBuilder.build(options)

  const state = {
    running: true,
    startupTime: Date.now(),
  }

  const bot = {
    status() {
      wechaty.say(`🤖 ${state.running ? '服务已启动' : '服务已停止'}`)
    },
    run() {
      if (state.running) return

      state.running = true
      state.startupTime = Date.now()
      wechaty.say('🤖 服务已启动')
    },
    stop() {
      if (state.running === false) return

      state.running = false
      wechaty.say('🤖 服务已停止')
    },
    async listen() {
      log.info('🤖️ 正在启动微信...')
      await wechaty.start()
      log.info('🤖️ 正在登录到微信...')
    },
  }

  wechaty.use(QRCodeTerminal({ small: true }))

  wechaty.on('message', message => {
    // 忽略启动前的消息
    if (message.date().getTime() < state.startupTime) return

    // 优先处理自己的消息
    if (message.self()) return onSelf(bot, message)

    // 忽略停止后的消息和非文本消息
    if (state.running === false || isTextMessage(message) === false) return

    if (message.room()) return onRoom(message, handler)

    // 忽略非个人消息
    if (message.talker().type() === message.wechaty.Contact.Type.Individual) {
      return onFriend(message, handler)
    }
  })

  wechaty.on('login', user => {
    log.info(`🤖 ${user} 上线`)
  })

  wechaty.on('logout', user => {
    log.info(`🤖 ${user} 离线`)
  })

  wechaty.on('error', ex => {
    log.error(`🤖 错误：${ex.message}`)
  })

  return bot
}
