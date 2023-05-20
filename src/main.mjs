// @ts-check
import { EasyBot } from '@zhengxs/easybot'
import { WechatyBuilder, log } from 'wechaty'
import { QRCodeTerminal } from 'wechaty-plugin-contrib'

import { ask } from './ask.mjs'

const bot = WechatyBuilder.build({
  name: 'examples',
  puppet: 'wechaty-puppet-wechat4u',
  puppetOptions: { uos: true },
})

bot.use(QRCodeTerminal({ small: true }))

bot.use(
  EasyBot.build({
    onSelf() {},
    onIndividual: ask,
    onMentionSelf: ask,
  }),
)

bot.on('login', user => {
  log.info(`🤖 ${user} 上线`)
})

bot.on('logout', user => {
  log.info(`🤖 ${user} 离线`)
})

bot.on('error', ex => {
  log.error(`🤖 错误：${ex.message}`)
})

log.info('🤖️ 正在启动微信...')
await bot.start()
log.info('🤖️ 正在登录到微信...')
