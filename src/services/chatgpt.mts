import { ChatGPTAPI } from 'chatgpt'

import env from '../utils/env.mjs'

const api = new ChatGPTAPI({
  apiBaseUrl: env.CHATGPT_PROXY_API_BASE_URL,
  apiKey: env.CHATGPT_API_KEY,
})

export default api
