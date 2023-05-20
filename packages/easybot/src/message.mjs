// @ts-check
import * as wechaty from 'wechaty'
import * as Puppet from 'wechaty-puppet'

/**
 * 对话类型
 * @readonly
 * @enum {number}
 */
export const ConversationType = {
  /**
   * 自己
   */
  Self: -1,
  /**
   * 未知消息
   */
  Unknown: 0,
  /**
   * 私聊
   */
  Individual: 1,
  /**
   * 公众号
   */
  Official: 2,
  /**
   * 企业微信
   */
  Corporation: 3,
  /**
   * 群聊
   */
  Room: 4,
}

export class OutgoingMessage {
  ConversationType = ConversationType

  /**
   * @param {import('./easybot.mjs').EasyBot} robot
   * @param {wechaty.Message} message
   */
  constructor(robot, message) {
    const wechaty = message.wechaty

    /**
     * 机器人信息
     *
     * @type {import('./easybot.mjs').EasyBot}
     */
    this.robot = robot

    /**
     * 原始消息内容
     *
     * @type {wechaty.Message}
     */
    this.message = message

    /**
     * 消息来源
     * @type {wechaty.Wechaty}
     */
    this.wechaty = wechaty

    /**
     * 消息ID
     */
    this.id = message.id

    /**
     * 消息类型
     *
     * @type {Puppet.types.Message}
     */
    this.type = message.type()

    /**
     * 消息内容
     *
     * @type {string}
     */
    this.content = message.text()

    /**
     * 消息从发送到接收的延迟时间
     */
    this.age = message.age()

    /**
     * 创建时间
     *
     * @type {Date}
     */
    this.createAt = message.date()

    /**
     * 当前对话者
     *
     * @type {wechaty.Contact}
     */
    this.talker = message.talker()

    /**
     * 是否房间消息
     *
     * @type {wechaty.Room | undefined}
     */
    this.room = message.room()

    /**
     * 对话类型
     * @type {ConversationType}
     */
    this.conversationType = ConversationType.Unknown

    if (this.room) {
      this.conversationType = ConversationType.Room
    } else if (message.self()) {
      this.conversationType = ConversationType.Self
    } else {
      const ContactType = wechaty.Contact.Type

      switch (this.talker.type()) {
        case ContactType.Corporation:
          this.conversationType = ConversationType.Corporation
          break
        case ContactType.Official:
          this.conversationType = ConversationType.Official
          break
        case ContactType.Individual:
          this.conversationType = ConversationType.Individual
          break
        default:
          this.conversationType = ConversationType.Unknown
      }
    }
  }

  /**
   * 说点什么
   *
   * @param {wechaty.Sayable} sayable
   * @param  {wechaty.Contact| wechaty.Contact[]} [replyTo]
   * @returns {Promise<void | wechaty.Message>}
   */
  say(sayable, replyTo) {
    if (this.room) {
      // @ts-ignore
      return this.room.say(sayable, replyTo)
    } else {
      return this.message.say(sayable)
    }
  }

  /**
   * 直接回复消息给对话者
   *
   * @param {wechaty.Sayable} sayable
   * @returns {Promise<void | wechaty.Message>}
   */
  reply(sayable) {
    return this.say(sayable, this.talker)
  }
}
