// @ts-check
import fetch from 'node-fetch'

import { ChatServiceError } from '../../lib/error.mjs'

const UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'

const mv = {
  /**
   * @param {string} keyword
   * @param {number} page
   * @param {number} pageSize
   * @returns {Promise<{ total: number; items: object[] }>}
   */
  async search(keyword, page = 1, pageSize = 10) {
    try {
      const searchParams = new URLSearchParams()

      searchParams.set('keyword', keyword)
      searchParams.set('page', page.toString())
      searchParams.set('pagesize', pageSize.toString())

      const response = await fetch(
        `http://mvsearch.kugou.com/mv_search?${searchParams.toString()}`,
        {
          method: 'GET',
          headers: { 'User-Agent': UA },
        },
      )

      /**
       * @type {object}
       */
      const res = await response.json()
      if (res.error_code === 0 && res.data.total > 0) {
        const { total, lists } = res.data
        return { items: lists, total }
      }

      console.log(`[ERROR] 酷狗音乐 MV 搜索失败: ${res.error_msg}`)
    } catch (ex) {
      console.log(`[ERROR] 酷狗音乐 MV 搜索失败: ${ex.message}`)
    }

    return { items: [], total: 0 }
  },
  /**
   * @param {string} hash
   * @returns {Promise<Object>}
   */
  async get(hash) {
    const searchParams = new URLSearchParams()

    searchParams.set('cmd', '100')
    searchParams.set('hash', hash)
    searchParams.set('ismp3', '1')
    searchParams.set('ext', 'mp4')

    const response = await fetch(
      `http://m.kugou.com/app/i/mv.php?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': UA,
        },
      },
    )

    /**
     * @type {object}
     */
    const mv = await response.json()

    const url =
      mv.mvdata.hd?.downurl ||
      mv.mvdata.sd?.downurl ||
      mv.mvdata.sq?.downurl ||
      mv.mvdata.lq?.downurl ||
      mv.mvdata.rq?.downurl ||
      mv.mvdata.le?.downurl

    return {
      url,
      authors: mv.authors,
      songName: mv.songname,
      singerName: mv.singer,
      image: mv.mvicon.replace('{size}', '600'),
    }
  },
  /**
   * @param {string} keyword
   * @returns {Promise<object | void>}
   */
  async searchAndGetOne(keyword) {
    const res = await mv.search(keyword)
    if (res.total === 0) return
    return mv.get(res.items[0]['MvHash'])
  },
}

const song = {
  /**
   * @param {string} keyword
   * @param {number} page
   * @param {number} pageSize
   * @returns {Promise<{ total: number; items: object[] }>}
   */
  async search(keyword, page = 1, pageSize = 10) {
    try {
      const url = new URL('http://mobilecdn.kugou.com/api/v3/search/song')
      url.searchParams.set('format', 'json')
      url.searchParams.set('keyword', keyword)
      url.searchParams.set('page', page.toString())
      url.searchParams.set('pagesize', pageSize.toString())
      url.searchParams.set('showtype', '1')

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'User-Agent': UA },
      })

      /**
       * @type {object}
       */
      const res = await response.json()

      if (res.errcode === 0 && res.data.total > 0) {
        const { total, info } = res.data
        return { total, items: info }
      }

      console.log(`[ERROR] 酷狗音乐搜索失败: ${res.errmsg}`)
    } catch (ex) {
      console.log(`[ERROR] 酷狗音乐搜索失败: ${ex.message}`)
    }

    return { items: [], total: 0 }
  },
  /**
   * @param {string} hash
   * @returns {Promise<Object>}
   */
  async get(hash) {
    const url = `http://m.kugou.com/app/i/getSongInfo.php?cmd=playInfo&hash=${hash}`
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': UA },
    })

    /**
     * @type {object}
     */
    const res = await response.json()

    return {
      authors: res.authors,
      url: res.url,
      songName: res.songName,
      singerName: res.singerName,
      image: res.imgUrl.replace('{size}', '600'),
      error: res.error,
    }
  },
  /**
   * @param {string} keyword
   * @returns {Promise<object | void>}
   */
  async searchAndGetOne(keyword) {
    const res = await song.search(keyword)
    if (res.total === 0) {
      throw new ChatServiceError('酷狗音乐', '找不到对应的歌手或歌曲')
    }

    // 过滤掉无版权的歌曲
    const found = res.items.find(c => c.pay_type_sq === 0)
    if (!found) {
      throw new ChatServiceError(
        '酷狗音乐',
        `没有找到可以播放的无版权或免费的歌曲`,
      )
    }

    return song.get(found['hash'])
  },
}

/**
 * @param {string} keyword
 * @param {boolean} ismv
 * @returns {Promise<Required<import('wechaty').payloads.UrlLink> | void>}
 */
export async function searchAndGetOne(keyword, ismv) {
  const result = await (ismv
    ? mv.searchAndGetOne(keyword)
    : song.searchAndGetOne(keyword))
  if (!result) return

  let description = ''

  if (result.authors?.length > 1) {
    description = `我在酷狗已为你找到由${result.authors
      .slice(0, 3)
      .map(a => a.author_name)
      .join('与')}等人演唱的歌曲“${result.songName}“`
  } else {
    description = `我在酷狗已为你找到由${result.singerName}演唱的歌曲“${result.songName}”`
  }

  if (result.error) {
    throw new ChatServiceError('酷狗音乐', `${result.songName} ${result.error}`)
  }

  return {
    title: result.songName,
    description: description,
    thumbnailUrl: result.image,
    url: result.url,
  }
}

export default {
  song,
  mv,
}
