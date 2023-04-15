// @ts-check

const help = `🤖 使用说明

启动服务: /r
停止服务: /s
查看状态: /t
获取帮助: /h
`

/**
 * 处理自身消息
 *
 * @param {*} bot
 * @param {import('wechaty').Message} message
 */
export function onSelf(bot, message) {
  const talker = message.talker()
  switch (message.text()) {
    case '/r':
      bot.run()
      break
    case '/s':
      bot.stop()
      break
    case '/t':
      bot.status()
      break
    case '/h':
      talker.say(help)
      break
  }
}
