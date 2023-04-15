// @ts-check
import toSingleQuotes from 'to-single-quotes'

import ai from '../openai/api.mjs'
import { searchAndGetOne } from './kugou.mjs'

// 触发服务的关键字
const keywords = ['播放', '歌曲', 'mv']

const parts = [
  '你是一个音乐搜索和推荐助手,请严格按照下面格式给到解析结果: ',
  '如果存在歌手不存在歌曲,返回:{"singer":"歌手名称","song": null,"ismv": true or false}.',
  '如果存在歌曲不存在歌手,返回:{"singer":null,"song": "歌曲名称","ismv": true or false}.',
  '如果歌曲和歌手都不存在,将内容作为歌曲名使用,返回:{"singer":null,"song": "歌曲名称","ismv": true or false}.',
  '注意:你是个JSON解析引擎，只解析不解释,不输出提示文字.',
  '这是需要解析的内容:',
].join('\n')

/**
 *
 * @param {string} text
 * @returns {Promise<[string | null, boolean]>}
 */
async function parseUserMessage(text) {
  const prompt = `${parts}"${toSingleQuotes(text)}"`
  const res = await ai.sendMessage(prompt)

  try {
    const result = JSON.parse(res.text)
    const qs = []

    if (result.singer) {
      qs.push(result.singer)
    }

    if (result.singer) {
      qs.push(result.song)
    }

    return [qs.join(' '), result.ismv === true]
  } catch {
    return [null, false]
  }
}

export default {
  /**
   * @param {import('../../lib/robot.mjs').RobotMessage} payload
   * @returns {boolean}
   */
  isMatch(payload) {
    const content = payload.content.toLowerCase()
    return keywords.some(k => content.includes(k))
  },
  /**
   * @param {import('../../lib/robot.mjs').RobotMessage} payload
   */
  async handler({ id, content, reply }) {
    const [keyword, ismv] = await parseUserMessage(content)
    if (!keyword) {
      reply('🤖️ 找不到对应的歌手或歌曲', true)
      return
    }

    const result = await searchAndGetOne(keyword, ismv)
    if (!result) {
      reply(`🤖️ 找不到 “${keyword}” 的播放地址`, true)
      return
    }

    // TODO 当前不支持 UrlLink
    reply(`${result.description}\n${result.url}`, true)
  },
}
