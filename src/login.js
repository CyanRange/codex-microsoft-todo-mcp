import { createClient, scopes } from "./auth.js";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";

const deviceCodePath = ".auth/device-code.txt";

try {
  const app = await createClient();
  const result = await app.acquireTokenByDeviceCode({
    scopes,
    deviceCodeCallback: (response) => {
      mkdirSync(".auth", { recursive: true });
      writeFileSync(deviceCodePath, response.message, "utf8");
      console.log(response.message);
    }
  });
  rmSync(deviceCodePath, { force: true });
  console.log(`登录成功：${result.account?.username ?? "Microsoft 账户"}`);
  console.log("令牌已保存到本机 .auth 目录；该目录已被 .gitignore 排除。 ");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
