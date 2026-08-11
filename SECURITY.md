# Security Policy

[English](#english) | [简体中文](#简体中文)

## English

## Sensitive data

Do not include any of the following in an issue, discussion, pull request, screenshot, or log:

- `.auth/msal-cache.json`
- access tokens, refresh tokens, or ID tokens
- device login codes
- client secrets
- personal task IDs or task contents
- email addresses or tenant identifiers

If a token is exposed, revoke the application's consent or the relevant account sessions and sign in again before continuing.

## Reporting a vulnerability

Please use GitHub's private security-advisory reporting feature when it is available for this repository. Otherwise, open a minimal issue that contains no credentials or personal data and asks the maintainer for a private contact channel.

---

## 简体中文

## 敏感数据

请勿在 Issue、Discussion、Pull Request、截图或日志中包含以下内容：

- `.auth/msal-cache.json`
- 访问令牌、刷新令牌或 ID 令牌
- 设备登录代码
- 客户端密码
- 个人任务 ID 或任务内容
- 电子邮箱地址或租户标识符

如果令牌意外泄露，请撤销应用程序授权或相关账户会话，然后重新登录，再继续使用。

## 报告安全漏洞

如果本仓库已启用 GitHub 私有安全公告报告功能，请优先通过该功能报告漏洞。否则，请创建一个不包含任何凭据或个人数据的简短 Issue，并向维护者申请私密联系方式。
