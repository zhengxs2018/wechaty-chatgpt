import { Wechaty, WechatyBuilder, WechatyOptions, log } from 'wechaty'
import { QRCodeTerminal } from 'wechaty-plugin-contrib'

export function createWechaty(options: WechatyOptions): Wechaty {
  const wechaty = WechatyBuilder.build(options)

  wechaty.use(QRCodeTerminal({ small: true }))

  wechaty.on('login', user => {
    log.info(`🤖 ${user} 上线`)
  })

  wechaty.on('logout', user => {
    log.info(`🤖 ${user} 离线`)
  })

  wechaty.on('error', ex => {
    log.error(`🤖 错误：${ex.message}`)
  })

  return wechaty
}
