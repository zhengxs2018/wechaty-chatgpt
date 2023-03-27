import { ChatGPTAPI } from 'chatgpt'

import { chatgptMessageHandler } from './chatgpt_message_handler.mjs'
import { createRobot } from './core/mod.mjs'

const bot = createRobot({
  name: 'WechatRobot',
  puppet: 'wechaty-puppet-wechat',
  puppetOptions: {
    uos: true,
  },
})

const api = new ChatGPTAPI({
  apiBaseUrl: process.env.CHATGPT_API_BASE_URL || 'https://closeai.deno.dev/v1',
  apiKey: process.env.CHATGPT_API_KEY,
  completionParams: {
    model: process.env.CHATGPT_MODEL || 'gpt-3.5-turbo',
  },
})

await bot.listen(chatgptMessageHandler(api))
