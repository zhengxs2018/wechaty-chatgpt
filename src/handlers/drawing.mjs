// @ts-check
import { defineMessageHandler } from '@zhengxs/easybot'
import { FileBox } from 'file-box'

import { randomInt, sleep } from '../shared/util.mjs'

const files = [
  {
    name: 'ai.jpg',
    url: 'https://bing.com/th?id=OHR.CormorantBridge_ZH-CN7673299694_1920x1080.jpg',
  },
  {
    name: 'ai.jpg',
    url: 'https://tse4.mm.bing.net/th/id/OIG.FiB3Gvh8VqXjL3X2LDLK',
  },
]

function randomFile() {
  return files[randomInt(0, files.length - 1)]
}

export default defineMessageHandler({
  isMatch(message) {
    return message.content.startsWith('画')
  },
  async postMessage({ message }) {
    const file = randomFile()

    // 防止消息频繁，图片发送失败
    await sleep(1500)
    await message.say(
      FileBox.fromUrl(file.url, {
        name: file.name,
      }),
    )

    await sleep(800)
    await message.reply('画完了')
  },
})
