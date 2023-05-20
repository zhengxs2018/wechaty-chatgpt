// @ts-check
import * as wechaty from 'wechaty'

/**
 * @typedef BlockInfo
 * @property {string} id - 用户ID
 * @property {string} reason - 封禁原因
 * @property {number} [expired] - 封禁到期时间
 */

/**
 * @typedef {Partial<BlockInfo> & { id: string }} BlockInfoInit
 */

/**
 * @param {BlockInfoInit[]} blockedUsers
 * @returns {BlockInfo[]}
 */
export function resolveBlockList(blockedUsers) {
  return blockedUsers.map(({ reason = '用户访问被限制', ...rest }) => ({
    ...rest,
    reason,
  }))
}

/**
 * @param {BlockInfo[]} blocklist
 * @param {wechaty.Contact} talker
 * @returns {boolean}
 */
export function isBlockedUser(blocklist, talker) {
  return blocklist.some(blockInfo => {
    return blockInfo.id === talker.id
  })
}
