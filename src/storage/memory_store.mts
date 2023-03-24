import { LRUCache } from 'lru-cache'

import type { StateStorage } from './storage.mjs'

export interface SessionStorageOptions {
  max?: number
  ttl?: number
}

export function createMemoryStore(
  options?: LRUCache<string, string, unknown>,
): StateStorage {
  const cache = new LRUCache<string, string>({
    max: 500,
    ttl: 1000 * 60 * 5,
    ...options,
  })

  return {
    get(key: string) {
      return Promise.resolve(cache.get(key))
    },
    set(key: string, value: string) {
      cache.set(key, value)
      return Promise.resolve()
    },
    delete(key: string) {
      cache.delete(key)
      return Promise.resolve()
    },
  }
}
