# ChatGPT & Wechaty

<a href="https://git1.mediinfo.cn/mdfe/developer/web-docs/-/merge_requests" target="_blank" rel="noopener noreferrer">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
</a>

基于 Wechaty & ChatGPT API 开发的微信聊天机器人。

## 如何使用？

**运行前置条件**

因为用了 `fetch` API，所以要求 `nodejs >= 18`，但你们可以使用 [node-fetch][node-fetch] 作为 `polyfill`。

推荐你们使用 `nvm` 或 [fnm][fnm] 等工具切换，项目已经添加了 `.node-version` 方便和工作环境区分。

**设置环境变量**

根据 `.env.example` 的示例创建 `.env` 文件。

```sh
# 使用了 justjavac 大佬提供的代理代理地址
# 避免直接调用 OpenAI API，导致可能存在被 openai 封号问题
# See https://github.com/justjavac/chatgpt
CHATGPT_PROXY_API_BASE_URL="https://closeai.deno.dev/v1"

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

## 特别注意

1. 据说用聊天机器人，可能存在被 **openai 封号** 的风险，使用时请慎重。
2. 因微信启动会同步最近的消息，为了避免被 **微信封号**，所以默认是不启用的，需要给登录账号给自身发送 **启动/关闭** 指令。

## 版权声明

MIT

[fnm]: https://github.com/Schniz/fnm
[node-fetch]: https://www.npmjs.com/package/node-fetch
