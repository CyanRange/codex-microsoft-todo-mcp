import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PublicClientApplication } from "@azure/msal-node";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const authDir = path.join(projectDir, ".auth");
const cachePath = path.join(authDir, "msal-cache.json");

export const scopes = ["Tasks.ReadWrite", "offline_access", "openid", "profile"];

function clientId() {
  const value = process.env.MS_TODO_CLIENT_ID?.trim();
  if (!value) {
    throw new Error("缺少 MS_TODO_CLIENT_ID。请先在 Entra 注册应用并设置该环境变量。");
  }
  return value;
}

async function readCache() {
  try {
    return await fs.readFile(cachePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}

async function writeCache(data) {
  await fs.mkdir(authDir, { recursive: true });
  await fs.writeFile(cachePath, data, { encoding: "utf8", mode: 0o600 });
}

export async function createClient() {
  const cachePlugin = {
    beforeCacheAccess: async (context) => {
      const cache = await readCache();
      if (cache) context.tokenCache.deserialize(cache);
    },
    afterCacheAccess: async (context) => {
      if (context.cacheHasChanged) {
        await writeCache(context.tokenCache.serialize());
      }
    }
  };

  return new PublicClientApplication({
    auth: {
      clientId: clientId(),
      authority: "https://login.microsoftonline.com/common"
    },
    cache: { cachePlugin }
  });
}

export async function acquireCachedToken() {
  const app = await createClient();
  const accounts = await app.getTokenCache().getAllAccounts();
  if (!accounts.length) {
    throw new Error("尚未登录 Microsoft。请先在服务器目录运行 npm run login。");
  }

  try {
    return await app.acquireTokenSilent({ account: accounts[0], scopes });
  } catch (error) {
    throw new Error(`登录已过期或需要重新授权。请运行 npm run login。详情：${error.message}`);
  }
}
