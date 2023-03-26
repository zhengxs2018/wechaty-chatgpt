import type { Message } from 'wechaty'

import type { Robot } from './interfaces.mjs'

const help = `🤖 使用说明

启动服务: /r, /start
停止服务: /s, /stop
查看状态: /t, /status
获取帮助: /h, /help
`

export function processMessageFromRoot(bot: Robot, message: Message) {
  const talker = message.talker()

  switch (message.text().trim()) {
    case '/r':
    case '/start':
      bot.start()
      break
    case '/s':
    case '/stop':
      bot.stop()
      break
    case '/t':
    case '/status':
      bot.heartbeat()
      break
    case '/h':
    case '/help':
      talker.say(help)
      break
  }
}
