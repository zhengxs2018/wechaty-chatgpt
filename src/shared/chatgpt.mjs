// @ts-check
import fetch from 'node-fetch'

import { ChatGPTAPI } from 'chatgpt'

export default new ChatGPTAPI({
  apiBaseUrl: process.env.CHATGPT_API_BASE_URL,
  // @ts-ignore
  apiKey: process.env.CHATGPT_API_KEY,
  apiOrg: process.env.CHATGPT_API_ORG,
  // @ts-ignore
  fetch: fetch,
  // maxModelTokens: 512,
  completionParams: {
    model: 'gpt-3.5-turbo',
  },
})
