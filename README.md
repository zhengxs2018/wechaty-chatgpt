# ChatGPT & Wechaty

> 本项目仅提供学习用途，如有任何问题，需要自行承担风险。

<a href="https://github.com/zhengxs2018/wechaty-chatgpt" target="_blank" rel="noopener noreferrer">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
</a>

基于 Wechaty & ChatGPT API 开发的微信聊天机器人。

## 必读内容

> 请注意保护微信账号

1. 国内直接调用接口，可能被 OpenAI 封号。
2. 频发登录会报 `1209` 错误，等会就会恢复
3. 频繁发送图片会报 `1205` 错误，等会就会恢复
4. 新微信号加人频繁会被关小黑屋

## 如何使用？

**设置环境变量**

点击 [这里](https://platform.openai.com/account/api-keys) 获取你的 API KEY。

```sh
# 1. 创建环境配置文件
$ cp .env.example .env

# 2. 修改为你的 API 密钥
CHATGPT_API_KEY="sk-xxx"
```

> 国内使用 ChatGPT，请用代理访问 [OpenAI Proxy](https://github.com/justjavac/chatgpt)。

**启动项目**

```sh
# 安装依赖
$ pnpm install

# 启动项目
$ pnpm start
```

## 加群体验

<img src="https://user-images.githubusercontent.com/7506913/231931222-21238a9d-6d22-43d5-a257-b92c3363dda1.png" alt="加群体验" width="240px" /><img src="https://user-images.githubusercontent.com/7506913/228170658-8d42605a-5d7c-42ed-bab3-b29ae3370e9b.jpg" alt="一起急眼" width="240px" /><img src="https://user-images.githubusercontent.com/7506913/228170706-9f085654-a79e-4e13-ad4f-3235275d6eed.png" alt="一起急眼" width="240px" />

## 支持的 NodeJS 版本

> 目前本地测试的版本

- 16.19.1
- 18.12.1

推荐使用 `nvm` 或 [fnm][fnm] 管理 Node.js 版本。

## 感谢

以下排名不分先后。

- [ChatGPT](https://openai.com/)
- [github: transitive-bullshit/chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api)
- [github: wechaty/wechaty](https://github.com/wechaty/wechaty)
- [github: justjavac/chatgpt](https://github.com/justjavac/chatgpt)
- and more...

## License

MIT

[fnm]: https://github.com/Schniz/fnm
