# ChatGPT & Wechaty

<a href="https://git1.mediinfo.cn/mdfe/developer/web-docs/-/merge_requests" target="_blank" rel="noopener noreferrer">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
</a>

基于 Wechaty & ChatGPT API 开发的微信聊天机器人。

## 如何使用？

> 需要安装 `nodejs >= 18` 和 `pnpm`。

推荐你们使用 `nvm` 或 [fnm][fnm] 管理 Node.js 版本。

**环境变量**

点击 [这里](https://platform.openai.com/account/api-keys) 获取你的 API KEY。

```sh
# 你的 API 密钥
CHATGPT_API_KEY="sk-xxx"
```

**启动项目**

```sh
# 安装依赖
$ pnpm install

# 启动项目
$ pnpm start
```

## 指令

### 控制指令

| 名称        | 描述         | 谁可以使用？         | 如何使用？         |
| ----------- | ------------ | -------------------- | ------------------ |
| /r, /start  | 启动机器人   | 机器人所登录的微信号 | 发送给自己的微信号 |
| /s, /stop   | 关闭机器人   | 机器人所登录的微信号 | 发送给自己的微信号 |
| /t, /status | 获取运行状态 | 机器人所登录的微信号 | 发送给自己的微信号 |
| /h, /help   | 获取帮助菜单 | 机器人所登录的微信号 | 发送给自己的微信号 |

### 聊天指令

提供了记录当前会话的功能，群聊和私聊使用不会的会话 ID。

> 注意：只重制自身，不会影响到他人。

| 名称       | 描述           | 谁可以使用？ | 如何使用？                 |
| ---------- | -------------- | ------------ | -------------------------- |
| /r, /reset | 重新开始会话   | 所有人       | 私聊直接发送，群内 @机器人 |
| /c, /code  | 获取机器人源码 | 所有人       | 私聊直接发送，群内 @机器人 |
| /h, /help  | 获取帮助菜单   | 所有人       | 私聊直接发送，群内 @机器人 |

## 加群体验

<img src="https://user-images.githubusercontent.com/7506913/227771731-ed6febf3-a6bb-44c7-95d6-b48acd4fdf0c.jpeg" alt="加群体验" width="240px" />

## 感谢

以下排名不分先后。

- [ChatGPT](https://openai.com/)
- [github: transitive-bullshit/chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api)
- [github: wechaty/wechaty](https://github.com/wechaty/wechaty)
- [github: justjavac/chatgpt](https://github.com/justjavac/chatgpt)
- and more...

## 特别说明

目前有相同类型项目反馈，存在封号问题，请谨慎使用。

1. 国内直接调用接口，可能被 OpenAI 封号。
2. 将微信账号提供给机器人使用，被 微信 封号。

本项目仅提供学习用途，请自行承担风险。

## License

MIT

[fnm]: https://github.com/Schniz/fnm
