# Local Microsoft To Do MCP

[English](#english) | [简体中文](#简体中文)

## English

A small local [Model Context Protocol](https://modelcontextprotocol.io/) server that lets Codex and other MCP clients work with Microsoft To Do through Microsoft Graph.

It currently exposes five tools:

- `list_task_lists`
- `list_tasks`
- `create_task`
- `update_task`
- `complete_task`

Authentication uses Microsoft's device-code flow. No client secret or local callback server is required.

## Requirements

- Node.js 20 or later
- A Microsoft account with Microsoft To Do
- Access to a Microsoft Entra tenant in which you can register an application
- A local MCP client such as Codex

## 1. Register your own Entra application

Create an app registration in the [Microsoft Entra admin center](https://entra.microsoft.com/):

1. Choose a neutral display name such as `Local_Todo_Connector`.
2. Select **Accounts in any organizational directory and personal Microsoft accounts**, or the narrower account type appropriate for you.
3. Under **API permissions**, add the delegated Microsoft Graph permission `Tasks.ReadWrite`.
4. Under **Authentication**, enable public client flows.
5. Add the **Mobile and desktop applications** redirect URI:

   ```text
   https://login.microsoftonline.com/common/oauth2/nativeclient
   ```

6. Copy the **Application (client) ID**. Do not create a client secret.

Each user should create and use their own app registration. Do not publish account tokens or the local authentication cache.

## 2. Install and sign in

```powershell
git clone https://github.com/CyanRange/codex-microsoft-todo-mcp.git
cd codex-microsoft-todo-mcp
npm install
$env:MS_TODO_CLIENT_ID = "YOUR_APPLICATION_CLIENT_ID"
npm run login
```

Follow the device-login instructions shown in the terminal. The token cache is stored locally under `.auth/`, which is excluded by `.gitignore`.

## 3. Add it to Codex

From PowerShell, replace the placeholders with your values:

```powershell
codex mcp add microsoft_todo `
  --env MS_TODO_CLIENT_ID=YOUR_APPLICATION_CLIENT_ID `
  -- node C:\absolute\path\to\codex-microsoft-todo-mcp\src\server.js
```

Confirm the registration:

```powershell
codex mcp list
```

Start a new Codex session after adding the server. You can then ask Codex to list To Do lists, create a task, update it, or mark it complete.

## Security and privacy

- `.auth/`, `.env`, and `node_modules/` are excluded from Git.
- Never commit `msal-cache.json`; it can contain access and refresh tokens.
- The application client ID is an identifier rather than a password, but this repository intentionally contains no personal client ID.
- The server requests delegated `Tasks.ReadWrite` access and acts only as the signed-in user.
- Review tool calls before allowing an MCP client to change real tasks.

See [SECURITY.md](SECURITY.md) for reporting guidance.

## Development

```powershell
npm install
node --check src/auth.js
node --check src/graph.js
node --check src/login.js
node --check src/server.js
```

## License and trademarks

Released under the [MIT License](LICENSE).

This is an independent, unofficial project. It is not affiliated with, endorsed by, or sponsored by Microsoft or OpenAI. Microsoft, Microsoft To Do, Microsoft Graph, OpenAI, and Codex are trademarks of their respective owners and are used only to describe compatibility.

---

## 简体中文

这是一个小型本地 [Model Context Protocol（MCP）](https://modelcontextprotocol.io/)服务器，让 Codex 和其他 MCP 客户端能够通过 Microsoft Graph 操作 Microsoft To Do。

目前提供五个工具：

- `list_task_lists`：列出任务清单
- `list_tasks`：列出清单中的任务
- `create_task`：创建任务
- `update_task`：修改任务
- `complete_task`：将任务标记为已完成

身份验证使用 Microsoft 设备代码流程，不需要客户端密码，也不需要运行本地回调服务器。

## 环境要求

- Node.js 20 或更高版本
- 已开通 Microsoft To Do 的 Microsoft 账户
- 一个可以注册应用程序的 Microsoft Entra 租户
- Codex 等本地 MCP 客户端

## 1. 注册自己的 Entra 应用

在 [Microsoft Entra 管理中心](https://entra.microsoft.com/)创建应用注册：

1. 使用中性的显示名称，例如 `Local_Todo_Connector`。
2. 选择 **任何组织目录中的账户和个人 Microsoft 账户**，或根据实际需求选择范围更窄的账户类型。
3. 在 **API 权限**中添加 Microsoft Graph 委托权限 `Tasks.ReadWrite`。
4. 在 **身份验证**中启用公共客户端流。
5. 添加 **移动和桌面应用程序**重定向 URI：

   ```text
   https://login.microsoftonline.com/common/oauth2/nativeclient
   ```

6. 复制 **应用程序（客户端）ID**。不要创建客户端密码。

每位用户都应注册并使用自己的应用。不要公开账户令牌或本地身份验证缓存。

## 2. 安装并登录

```powershell
git clone https://github.com/CyanRange/codex-microsoft-todo-mcp.git
cd codex-microsoft-todo-mcp
npm install
$env:MS_TODO_CLIENT_ID = "你的应用程序客户端 ID"
npm run login
```

按照终端显示的设备登录提示完成授权。令牌缓存保存在本机 `.auth/` 目录中，该目录已被 `.gitignore` 排除。

## 3. 接入 Codex

在 PowerShell 中运行以下命令，并将占位内容替换为你的实际值：

```powershell
codex mcp add microsoft_todo `
  --env MS_TODO_CLIENT_ID=你的应用程序客户端ID `
  -- node C:\你的绝对路径\codex-microsoft-todo-mcp\src\server.js
```

确认 MCP 已经注册：

```powershell
codex mcp list
```

添加服务器后，请新建一个 Codex 会话。之后就可以让 Codex 列出 To Do 清单、创建任务、修改任务或将任务标记为完成。

## 安全与隐私

- `.auth/`、`.env` 和 `node_modules/` 均已被 Git 排除。
- 切勿提交 `msal-cache.json`；其中可能包含访问令牌和刷新令牌。
- 应用程序客户端 ID 是标识符而不是密码，但本仓库仍不会包含任何个人客户端 ID。
- 服务器只请求委托的 `Tasks.ReadWrite` 权限，并且只能以当前登录用户的身份操作。
- 在允许 MCP 客户端修改真实任务前，请先检查工具调用内容。

安全问题的报告方式请参阅 [SECURITY.md](SECURITY.md)。

## 开发检查

```powershell
npm install
node --check src/auth.js
node --check src/graph.js
node --check src/login.js
node --check src/server.js
```

## 许可证与商标

本项目采用 [MIT License](LICENSE) 发布。

这是一个独立的非官方项目，与 Microsoft 或 OpenAI 不存在隶属、认可或赞助关系。Microsoft、Microsoft To Do、Microsoft Graph、OpenAI 和 Codex 是其各自所有者的商标；本项目仅为说明兼容性而使用这些名称。
