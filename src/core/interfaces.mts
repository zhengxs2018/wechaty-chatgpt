import type { Sayable } from 'wechaty'

/**
 * 机器人
 */
export interface Robot {
  /**
   * 启动服务
   */
  start(): void

  /**
   * 停止服务
   */
  stop(): void

  /**
   * 健康检查
   */
  heartbeat(): void

  /**
   * 监听消息
   */
  listen(handler: MessageListener): Promise<void>
}

export type MessageListener = (
  id: string,
  message: string,
  reply: (sayable: Sayable) => void,
) => void

