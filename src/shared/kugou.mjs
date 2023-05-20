// @ts-check
import fetch from 'node-fetch'

const UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'

/**
 * @typedef {object} KuGouAuthor
 * @property {string} singerName
 * @property {string} author_name
 */

/**
 * @typedef {object} KuGouMV
 * @property {string} url
 * @property {KuGouAuthor[]} authors
 * @property {string} songName
 * @property {string} singerName
 * @property {string} image
 */

/**
 * @typedef {object} KuGouSong
 * @property {string} url
 * @property {KuGouAuthor[]} authors
 * @property {string} songName
 * @property {string} singerName
 * @property {string} image
 * @property {string} [error]
 */

const mv = {
  /**
   * @param {string} keyword
   * @param {number} page
   * @param {number} pageSize
   * @returns {Promise<{ total: number; page: number; pageSize: number; pages: number; items: object[] }>}
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
        const { lists, page, total, pagesize } = res.data
        const pages = Math.floor(total / pageSize)
        return { items: lists, page, pageSize: pagesize, pages, total }
      }

      console.log(`[ERROR] 酷狗音乐 MV 搜索失败: ${res.error_msg}`)
    } catch (ex) {
      console.log(`[ERROR] 酷狗音乐 MV 搜索失败: ${ex.message}`)
    }

    return { items: [], page: 1, pageSize: 10, pages: 0, total: 0 }
  },
  /**
   * @param {string} hash
   * @returns {Promise<KuGouMV>}
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
}

const song = {
  /**
   * @param {string} keyword
   * @param {number} page
   * @param {number} pageSize
   * @returns {Promise<{ total: number; page: number; pageSize: number; pages: number; items: object[] }>}
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
        const pages = Math.floor(total / pageSize)
        return { page, pageSize, total, pages, items: info }
      }

      console.log(`[ERROR] 酷狗音乐搜索失败: ${res.errmsg}`)
    } catch (ex) {
      console.log(`[ERROR] 酷狗音乐搜索错误: ${ex.message}`)
    }

    return { items: [], page, pageSize, pages: 0, total: 0 }
  },
  /**
   * @param {string} hash
   * @returns {Promise<KuGouSong>}
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
}

export default {
  song,
  mv,
}
