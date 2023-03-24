import { log } from 'wechaty'

import { onMessage } from './handlers/on_message.mjs'
import bot from './services/wechaty.mjs'

bot.on('message', onMessage)

bot.on('login', user => {
  log.info(`🤖 ${user} 已登录`)
  bot.say('🤖 机器人上线了')
})

bot.on('logout', user => {
  log.info(`🤖 ${user} 已登出`)
})

bot.on('error', ex => {
  log.error('🤖 错误：$s', ex.message)
})

await bot.start()
log.info('开始登录微信...')
