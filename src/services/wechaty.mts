import { WechatyBuilder } from 'wechaty'
import { Heartbeat, QRCodeTerminal } from 'wechaty-plugin-contrib'

// 注意: 多人反馈存在封号风险, 请谨慎使用
const bot = WechatyBuilder.build({
  name: 'WechatRobot',
  puppet: 'wechaty-puppet-wechat',
  puppetOptions: {
    uos: true,
  },
})

bot.use(
  Heartbeat({
    contact: 'filehelper',
    emoji: {
      heartbeat: '😎',
    },
    intervalSeconds: 60,
  }),
)

bot.use(QRCodeTerminal({ small: true }))

export default bot
