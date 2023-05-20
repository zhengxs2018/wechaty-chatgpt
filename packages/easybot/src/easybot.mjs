// @ts-check
import * as wechaty from 'wechaty'

import { isBlockedUser, resolveBlockList } from './blocklist.mjs'
import { OutgoingMessage } from './message.mjs'
import { removeQuoteContent } from './utils.mjs'

/**
 * @param {string | string[]} [alias]
 * @returns {string[]}
 */
function resolveAlias(alias) {
  if (Array.isArray(alias)) return alias
  return alias ? [alias] : []
}

/**
 * @param {string[]} alias
 * @returns {RegExp}
 */
function parseNamesToPattern(alias) {
  if (alias.length === 1) {
    return new RegExp(`(^|\\s)@${alias[0]}($|\\s)`, 'g')
  }

  return new RegExp(`(^|\\s)@(${alias.join('|')})($|\\s)`, 'g')
}

/**
 * @callback MessageEventHandler
 * @param {OutgoingMessage} message
 * @returns {void | Promise<unknown>}
 */

/**
 * @typedef EasyBotInit
 * @property {string | string[]} [alias] - 机器人别名，hack 处理 web 接口，群设置的机器人别名获取不到的问题
 * @property {boolean} [keepQuoteContent = false] - 是否保留被引用的消息内容，仅对群消息有效
 * @property {import('./blocklist.mjs').BlockInfoInit[]} [blockedUsers] - 禁止访问用户列表
 * @property {(blocklist: import('./blocklist.mjs').BlockInfo[], talker: wechaty.Contact) => Promise<boolean>} [isBlockedUser] - 是否为禁止访问用户
 * @property {MessageEventHandler} [onSelf] - 自身消息处理
 * @property {MessageEventHandler} onMentionSelf - 在群里被提及
 * @property {MessageEventHandler} onIndividual - 接收到私聊消息
 */

// TODO 与 wechaty 解耦
export class EasyBot {
  /**
   * @param {EasyBotInit} init
   */
  constructor(init) {
    /**
     * 是否运行中
     *
     * 允许服务启动时停止消息处理
     *
     * @type {boolean}
     */
    this.running = false

    /**
     * 启动时间
     *
     * 防止消息同步导致重复处理
     *
     * @type {number}
     */
    this.startupTime = Date.now()

    /**
     * 机器人名称
     *
     * @type {string}
     */
    this.name = ''

    /**
     * 机器人别名
     *
     * @type {string[]}
     */
    this.alias = resolveAlias(init.alias)

    /**
     * 用户剔除提及机器人名称后的正则表达式
     *
     * @type {RegExp | undefined}
     */
    this.mentionSelfRE = undefined

    /**
     * 是否保留被引用的消息内容
     *
     * @type {boolean}
     */
    this.keepQuoteContent = init.keepQuoteContent !== false

    /**
     * 禁止访问用户列表
     *
     * @type {import('./blocklist.mjs').BlockInfo[]}
     */
    this.blockedUsers = resolveBlockList(init.blockedUsers || [])

    /**˝
     * 是否为被禁止的用户
     */
    this.isBlockedUser = init.isBlockedUser || isBlockedUser

    /**
     * 消息处理
     * @type {MessageEventHandler | undefined
     * }
     */
    this.onSelf = init.onSelf

    /**
     * 在群里被提及
     *
     * @type {MessageEventHandler}
     */
    this.onMentionSelf = init.onMentionSelf

    /**
     * 消息处理
     * @type {MessageEventHandler}
     */
    this.onIndividual = init.onIndividual
  }

  /**
   * @type {wechaty.WechatyPlugin}
   */
  setup(wechaty) {
    wechaty.on('message', async event => {
      // 忽略启动前的消息
      if (event.date().getTime() < this.startupTime) return

      const msgType = event.type()

      if (
        msgType === wechaty.Message.Type.Unknown ||
        // 防止空消息处理
        // NOTE: 微信启动会给自己发空消息？本地启动问题？
        (msgType === wechaty.Message.Type.Text && !event.text())
      )
        return

      // 优先处理自己的消息
      if (event.self()) {
        await this.onSelf?.(new OutgoingMessage(this, event))
        return
      }

      // 停止处理消息
      if (this.running === false) return

      const talker = event.talker()
      if (await this.isBlockedUser(this.blockedUsers, talker)) {
        wechaty.log.info('EasyBot', 'user %s is blocked', talker.name())
        return
      }

      try {
        // 个人微信号，只需要处理私聊和群聊消息
        if (event.room()) {
          // 房间只处理文本消息
          if (event.type() !== event.wechaty.Message.Type.Text) return

          await this.processRoomMessage(event)
        } else if (talker.type() === wechaty.Contact.Type.Individual) {
          await this.onIndividual(new OutgoingMessage(this, event))
        }
      } catch (ex) {
        wechaty.log.error('EasyBot', 'message rejection: %s', ex && ex.message)
      }
    })

    wechaty.on('login', user => {
      this.running = true
      this.startupTime = Date.now()
      this.name = user.name()
      this.mentionSelfRE = parseNamesToPattern(this.alias.concat(this.name))
    })

    wechaty.on('logout', () => {
      this.running = false
    })
  }

  /**
   * @param {wechaty.Message} event
   * @returns
   */
  async processRoomMessage(event) {
    const message = new OutgoingMessage(this, event)

    // NOTE: 为了方便用户不重复打字，可以允许使用引用的消息内容
    const content = removeQuoteContent(message.content)

    const isMentioned = await event.mentionSelf()
    if (!isMentioned) return

    const keepQuoteContent = this.keepQuoteContent

    if (keepQuoteContent === false) {
      message.content = content
    }

    // 清理提及自己的消息
    const mentionSelfRE = this.mentionSelfRE || parseNamesToPattern([this.name])
    message.content = message.content.replace(mentionSelfRE, '')

    // 跳过空内容
    if (message.content.length === 0) return

    return this.onMentionSelf(message)
  }

  /**
   * @param {EasyBotInit} init
   * @returns {wechaty.WechatyPlugin}
   */
  static build(init) {
    const bot = new EasyBot(init)
    return wechaty => bot.setup(wechaty)
  }
}
