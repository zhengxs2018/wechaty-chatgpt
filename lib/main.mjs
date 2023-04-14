import fetch from 'node-fetch'

import { createWechaty } from './create_wechaty.mjs';
import { createChatGPTClient } from './create_chatgpt_client.mjs'
import { createChatgptHandler } from './create_chatgpt_handler.mjs';

const client = createChatGPTClient({
  apiBaseUrl: process.env.CHATGPT_API_BASE_URL,
  apiKey: process.env.CHATGPT_API_KEY,
  apiOrg: process.env.CHATGPT_API_ORG,
  fetch: fetch
})

const messageHandler = createChatgptHandler(client)

const bot = createWechaty({
  name: 'WechatRobot',
  puppet: 'wechaty-puppet-wechat4u',
  puppetOptions: {
    uos: true
  },
  handler: messageHandler
});

await bot.listen();
