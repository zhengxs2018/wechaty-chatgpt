// @ts-check
import QuickLRU from 'quick-lru'

import { ChatServiceError } from './lib/error.mjs'
import { createRobot } from './lib/robot.mjs'
import kugou from './plugins/kugou/handler.mjs'
import chatgpt from './plugins/openai/handler.mjs'

// 防止 API 请求频率过高
const limiter = new QuickLRU({
  maxSize: 999,
  maxAge: 1000 * 60 * 5,
})

/**
 * @type {import('wechaty').WechatyOptions}
 */
const options = {
  name: 'WechatRobot',
  puppet: 'wechaty-puppet-wechat4u',
  puppetOptions: {
    uos: true,
  },
}

/**
 * @param {import('./lib/robot.mjs').RobotMessage} payload
 */
async function handler(payload) {
  const { user, reply } = payload
  try {
    if (limiter.get(user)) {
      reply('⌛️ 请稍等...')
      return
    }

    limiter.set(user, 'waiting')

    switch (true) {
      case kugou.isMatch(payload):
        await kugou.handler(payload)
        break
      default:
        await chatgpt(payload)
    }
  } catch (ex) {
    if (ex instanceof ChatServiceError) {
      reply(`🤖️ ${ex.service}: ${ex.message}`, true)
    } else {
      console.error('[Error] %s', ex.message)
      reply('🤖️ 服务好像坏了', true)
    }
  } finally {
    limiter.delete(user)
  }
}

createRobot(options, handler).listen()
