import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { mkdir, writeFile, rename } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { beginLogin, completeLogin } from "../app/lib/p2pobmen.ts";

// This helper runs in the owner's terminal, never in a public API route.
if (!process.stdin.isTTY || !process.stdout.isTTY) {
  console.error("Запустите npm run p2pobmen:login в интерактивном терминале.");
  process.exitCode = 1;
} else {
  let hidden = false;
  const output = new Writable({ write(chunk, encoding, callback) {
    if (!hidden) process.stdout.write(chunk, encoding);
    callback();
  } });
  const input = createInterface({ input: process.stdin, output, terminal: true, historySize: 0 });
  async function secret(label) {
    process.stdout.write(label);
    hidden = true;
    try { return await input.question(""); }
    finally { hidden = false; process.stdout.write("\n"); }
  }
  try {
    const username = (await input.question("Логин p2pobmen: ")).trim();
    const password = await secret("Пароль (ввод скрыт): ");
    const login = await beginLogin(username, password);
    let token = login.token;
    if (login.twoFactorIsUsed) {
      console.info("p2pobmen запросил подтверждение входа. Откройте письмо с кодом.");
      token = await completeLogin(login.challengeId, await secret("Код из почты (ввод скрыт): "));
    }
    if (!token) throw new Error("Токен сессии не получен");
    const directory = fileURLToPath(new URL("../.p2pobmen-auth/", import.meta.url));
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const files = {
      "env.json": JSON.stringify({ P2POBMEN_USERNAME: username, P2POBMEN_PASSWORD: password, P2POBMEN_AUTH_TOKEN: token }),
      "token": `${token}\n`,
    };
    for (const [name, value] of Object.entries(files)) {
      const temporary = `${directory}${name}.${randomUUID()}.tmp`;
      await writeFile(temporary, value, { mode: 0o600, flag: "wx" });
      await rename(temporary, `${directory}${name}`);
    }
    console.info("Вход подтверждён. Секреты сохранены в .p2pobmen-auth/ с доступом только владельцу.");
    console.info("Добавьте P2POBMEN_AUTH_TOKEN в production-переменные Vercel из файла token и выполните redeploy.");
    console.info("Значения не выведены в терминал. Не публикуйте файлы .p2pobmen-auth/.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Вход не выполнен");
    process.exitCode = 1;
  } finally { input.close(); }
}
