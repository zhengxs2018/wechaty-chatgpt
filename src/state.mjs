// @ts-check
import QuickLRU from 'quick-lru'

/**
 * 存储状态
 */
const stateStorage = new QuickLRU({
  maxSize: 500,
  maxAge: 1000 * 60 * 5,
})

/**
 * @param {string} sid
 * @returns {Record<string, any>}
 */
export function createUserState(sid) {
  if (stateStorage.has(sid)) return stateStorage.get(sid)

  const state = {}
  stateStorage.set(sid, state)

  return state
}

/**
 * @param {string} sid
 */
export function clearUserState(sid) {
  stateStorage.delete(sid)
}
