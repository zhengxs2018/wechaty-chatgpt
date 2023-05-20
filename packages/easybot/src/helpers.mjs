// @ts-ignore

/**
 * @typedef MessageHandlerContext
 * @property {import('./message.mjs').OutgoingMessage} message
 * @property {Record<string, any>} state
 * @property {AbortSignal} signal
 */

/**
 * @callback MessageSender
 * @param {MessageHandlerContext} context
 * @returns {Promise<void>}
 */

/**
 * @typedef MessageHandler
 * @property {(message: import('./message.mjs').OutgoingMessage) => boolean} isMatch
 * @property {MessageSender} postMessage
 */

/**
 * @param {MessageHandler | MessageSender} handler
 * @returns {MessageHandler}
 */
export const defineMessageHandler = handler => {
  if (typeof handler === 'function') {
    return {
      isMatch: () => true,
      postMessage: handler,
    }
  }

  return handler
}
