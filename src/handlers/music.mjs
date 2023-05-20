// @ts-check
import * as bot from '@zhengxs/easybot'
import toSingleQuotes from 'to-single-quotes'

import chatgpt from '../shared/chatgpt.mjs'
import kg from '../shared/kugou.mjs'

// 触发服务的关键字
const keywords = ['播放', '歌曲', 'mv']

const parts = [
  '你是一个音乐搜索和推荐助手,请严格按照下面格式给到解析结果: ',
  '如果存在歌手不存在歌曲,返回:{"singer":"歌手名称","song": null,"ismv": true or false, "page": page or 1}.',
  '如果存在歌曲不存在歌手,返回:{"singer":null,"song": "歌曲名称","ismv": true or false, "page": page or 1}.',
  '如果歌曲和歌手都不存在,将内容作为歌曲名使用,返回:{"singer":null,"song": "歌曲名称","ismv": true or false, "page": page or 1}.',
  '注意:你是个JSON解析引擎,只解析不解释,不输出任何提示文字.',
  '这是需要解析的内容:',
].join('\n')

/**
 * @param {string} text
 * @returns {Promise<[string | null, number, boolean]>}
 */
async function parseUserMessage(text) {
  const prompt = `${parts}"${toSingleQuotes(text)}"`
  const res = await chatgpt.sendMessage(prompt)

  try {
    const result = JSON.parse(res.text)
    const qs = []

    if (result.singer) {
      qs.push(result.singer)
    }

    if (result.song) {
      qs.push(result.song)
    }

    let page = parseInt(result.page)

    if (isNaN(page)) {
      page = 1
    }

    return [qs.join(' '), Math.max(page, 1), result.ismv === true]
  } catch {
    return [null, 0, false]
  }
}

/**
 * @param {bot.OutgoingMessage} msg
 * @param {object} query
 * @param {string} query.keyword
 * @param {number} [query.page]
 */
async function searchSong(msg, query) {
  const res = await kg.song.search(query.keyword, query.page)

  if (res.total === 0) {
    await msg.reply('[酷狗] 找不到对应的歌手或歌曲')
    return
  }

  try {
    const song = await kg.song.get(res.items[0]['hash'])

    if (song.error) {
      await msg.reply(
        `[酷狗] 因 "${song.songName}" ${song.error}，无法提供播放链接~`,
      )
      return
    }

    let description

    if (song.authors?.length > 1) {
      description = `已为你找到由${song.authors
        .slice(0, 3)
        .map(a => a.author_name)
        .join('与')}等人演唱的歌曲“${song.songName}“`
    } else {
      description = `已为你找到由${song.singerName}演唱的歌曲“${song.songName}”`
    }

    await msg.reply(`${description}\n\n${song.url}`)
  } catch (ex) {
    console.log('[酷狗] Fail $s', ex.message)
    await msg.reply(`[酷狗] 音乐播放失败`)
  }
}

/**
 * @param {bot.OutgoingMessage} message
 * @param {object} query
 * @param {string} query.keyword
 * @param {number} [query.page]
 */
async function searchMV(message, query) {
  const res = await kg.mv.search(query.keyword, query.page)

  if (res.total === 0) {
    await message.reply('[酷狗] 找不到对应的 MV')
    return
  }

  try {
    const headMV = await kg.mv.get(res.items[0]['MvHash'])

    let description
    if (headMV.authors?.length > 1) {
      description = `已为你找到由${headMV.authors
        .slice(0, 3)
        .map(a => a.author_name)
        .join('与')}等人演唱的歌曲“${headMV.songName}“`
    } else {
      description = `已为你找到由${headMV.singerName}演唱的歌曲“${headMV.songName}”`
    }

    await message.say(`${description}\n\n${headMV.url}`)

    const tips = `[酷狗] 已经为你找到(${res.total})条记录:\n\n${res.items
      .map((s, i) => `${i}. ${s.MvName}`)
      .join('\n')}\n\n当前在:${res.page}/${res.pages}`
    await message.reply(tips)
  } catch (ex) {
    console.log('[酷狗] $s', ex.message)
    await message.reply(`[酷狗] 视频播放失败`)
  }
}

export default bot.defineMessageHandler({
  isMatch(message) {
    const content = message.content.toLowerCase()
    return keywords.some(k => content.includes(k))
  },
  async postMessage({ message }) {
    const [keyword, page, ismv] = await parseUserMessage(message.content)
    if (!keyword) {
      await message.reply('[酷狗] 找不到对应的歌手或歌曲')
      return
    }

    if (ismv) {
      await searchMV(message, { keyword, page })
    } else {
      await searchSong(message, { keyword, page })
    }
  },
})
