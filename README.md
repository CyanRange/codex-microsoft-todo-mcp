# Local Microsoft To Do MCP

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
