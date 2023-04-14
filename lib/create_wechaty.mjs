// @ts-check

import { WechatyBuilder, log } from 'wechaty';
import { QRCodeTerminal } from 'wechaty-plugin-contrib';

import { handleIndividualMessage } from './handlers/individual.mjs';
import { handleRoomMessage } from './handlers/room.mjs';
import { handleSelfMessage } from './handlers/self.mjs';

import { isTextMessage } from './shared/utils.mjs'

export function createWechaty({ handler, ...options }) {
  const wechaty = WechatyBuilder.build(options);

  const state = {
    running: true,
    startupTime: Date.now(),
  }

  const bot = {
    wechaty,
    heartbeat() {
      wechaty.say(`🤖 ${state.running ? '服务已启动' : '服务已停止'}`);
    },
    run() {
      if (state.running) return;

      state.running = true;
      state.startupTime = Date.now();
      wechaty.say('🤖 服务已启动');
    },
    stop() {
      if (state.running === false) return

      state.running = false;
      wechaty.say('🤖 服务已停止');
    },
    async listen() {
      log.info('🤖️ 正在启动微信...');
      await wechaty.start();
      log.info('🤖️ 正在登录到微信...');
    },
  };

  wechaty.use(QRCodeTerminal({ small: true }));

  wechaty.on('message', message => {
    // 忽略启动前的消息
    if (message.date().getTime() < state.startupTime) return;

    // 优先处理自己的消息
    if (message.self()) {
      handleSelfMessage(bot, message);
      return;
    }


    // 忽略停止后的消息和非文本消息
    if (state.running === false || isTextMessage(message) === false) return;

    if (message.room()) {
      handleRoomMessage(message, handler);
      return;
    }

    // 忽略非个人消息
    if (message.talker().type() === wechaty.Contact.Type.Individual) {
      handleIndividualMessage(message, handler);
      return;
    }
  });

  wechaty.on('login', user => {
    log.info(`🤖 ${user} 上线`);
  });

  wechaty.on('logout', user => {
    log.info(`🤖 ${user} 离线`);
  });

  wechaty.on('error', ex => {
    log.error(`🤖 错误：${ex.message}`);
  });

  return bot;
}
