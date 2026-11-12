import { createServer } from "node:http";
import { readFile, mkdir, writeFile, rename } from "node:fs/promises";
import { randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { beginLogin, completeLogin } from "../../app/lib/p2pobmen.ts";
import { configureCronJob } from "./cron-job.mjs";

const project = "prj_ZdN8KPEBVSiQX0xdleEKu9dk88OP";
const scope = "a63909s-projects";
const allowedKeys = ["P2POBMEN_USERNAME", "P2POBMEN_PASSWORD", "P2POBMEN_AUTH_TOKEN", "P2POBMEN_PROCESS_TOKEN"];

async function readJson(path, fallback = {}) {
  try { return JSON.parse(await readFile(path, "utf8")); } catch (error) { if (error.code === "ENOENT") return fallback; throw new Error("Не удалось прочитать сохранённые настройки"); }
}

export async function savePrivate(directory, name, value) {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const temporary = resolve(directory, `${name}.${randomUUID()}.tmp`);
  await writeFile(temporary, value, { flag: "wx", mode: 0o600 });
  await rename(temporary, resolve(directory, name));
}

async function vercel(args, input = "") {
  return new Promise((resolvePromise, reject) => {
    const explicit = process.env.P2POBMEN_VERCEL_CLI;
    const binary = explicit || (process.platform === "win32" ? "npx.cmd" : "npx");
    const command = explicit ? args : ["--yes", "vercel@65.15.0", ...args];
    const child = spawn(binary, command, { shell: process.platform === "win32", stdio: ["pipe", "pipe", "pipe"], env: { ...process.env, VERCEL_TELEMETRY_DISABLED: "1" } });
    let output = "";
    child.stdout.on("data", chunk => { output += chunk; });
    // CLI output may contain sensitive details. Return only a fixed error message.
    child.stderr.resume();
    child.on("error", () => reject(new Error("Не удалось запустить Vercel CLI. Выполните npx vercel@65.15.0 login")));
    child.on("close", code => code === 0 ? resolvePromise(output) : reject(new Error("Vercel отклонил операцию. Войдите через npx vercel@65.15.0 login в аккаунт с командой a63909s-projects")));
    child.stdin.on("error", () => {});
    child.stdin.end(input);
  });
}

export async function installVercelVariables(env) {
  const inspected = JSON.parse(await vercel(["project", "inspect", "krivye-linii-web", "--scope", scope, "--json", "--non-interactive"]));
  const target = inspected.project || inspected;
  if (target.id !== project || target.name !== "krivye-linii-web" || (target.accountId && target.accountId !== "team_Oxmjb4uVNw6H3p3Piu1qPaNp")) throw new Error("Выбран другой проект Vercel; запись отменена");
  for (const key of allowedKeys) {
    if (typeof env[key] !== "string" || !env[key]) throw new Error("Сначала подтвердите вход в p2pobmen");
    await vercel(["env", "add", key, "--environment", "production", "--project", project, "--scope", scope, "--type", "secret", "--force", "--yes"], env[key]);
  }
  return { keys: allowedKeys, project: target.name };
}

export async function createSetupServer({ directory, login = beginLogin, confirm = completeLogin, scheduler = configureCronJob, install = installVercelVariables } = {}) {
  if (!directory) throw new Error("Не задан каталог защищённых настроек");
  const accessToken = randomBytes(32).toString("base64url");
  let pending;
  let busy = false;
  const html = await readFile(new URL("../p2pobmen-setup.html", import.meta.url));
  const script = await readFile(new URL("../p2pobmen-setup-browser.js", import.meta.url));
  const server = createServer(async (req, res) => {
    const origin = `http://127.0.0.1:${server.address().port}`;
    const headers = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'" };
    const send = (status, value) => { res.writeHead(status, { ...headers, "Content-Type": "application/json; charset=utf-8" }); res.end(JSON.stringify(value)); };
    if (req.headers.host !== `127.0.0.1:${server.address().port}`) return send(403, { error: "Недопустимый адрес" });
    if (req.method === "GET" && ["/", "/setup.js"].includes(req.url)) {
      res.writeHead(200, { ...headers, "Content-Type": req.url === "/" ? "text/html; charset=utf-8" : "text/javascript; charset=utf-8" });
      return res.end(req.url === "/" ? html : script);
    }
    const expected = Buffer.from(`Bearer ${accessToken}`), actual = Buffer.from(req.headers.authorization || "");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return send(401, { error: "Откройте ссылку, которую напечатал помощник настройки" });
    if (req.method === "GET" && req.url === "/api/status") {
      try {
        const env = await readJson(resolve(directory, "env.json"));
        const cron = await readJson(resolve(directory, "cron-job.json"));
        return send(200, { sessionSaved: Boolean(env.P2POBMEN_AUTH_TOKEN), cron });
      } catch { return send(500, { error: "Не удалось прочитать сохранённые настройки" }); }
    }
    if (req.method !== "POST" || req.headers.origin !== origin) return send(403, { error: "Недопустимый источник запроса" });
    if (busy) return send(409, { error: "Предыдущий шаг ещё выполняется" });
    busy = true;
    try {
      let data = "";
      for await (const chunk of req) { data += chunk; if (data.length > 12_000) throw new Error("Слишком большой запрос"); }
      const body = JSON.parse(data);
      if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Некорректный запрос");
      const persist = async (username, password, token) => {
        const saved = await readJson(resolve(directory, "env.json"));
        const env = { P2POBMEN_USERNAME: username, P2POBMEN_PASSWORD: password, P2POBMEN_AUTH_TOKEN: token,
          P2POBMEN_PROCESS_TOKEN: saved.P2POBMEN_PROCESS_TOKEN || randomBytes(32).toString("base64url") };
        await savePrivate(directory, "env.json", JSON.stringify(env));
        await savePrivate(directory, "token", `${token}\n`);
        pending = undefined;
        return { stage: "saved", message: "Вход подтверждён, сессия сохранена. Можно записать переменные в Vercel." };
      };
      if (req.url === "/api/login") {
        pending = undefined;
        const { username, password } = body;
        if (typeof username !== "string" || !username.trim() || typeof password !== "string" || !password) throw new Error("Введите логин и пароль");
        const result = await login(username.trim(), password);
        if (result.twoFactorIsUsed) {
          pending = { username: username.trim(), password, challengeId: result.challengeId, expiresAt: Date.now() + 10 * 60_000, attempts: 0 };
          return send(200, { stage: "code", message: "Введите код из письма p2pobmen." });
        }
        if (!result.token) throw new Error("p2pobmen не вернул сессию");
        return send(200, await persist(username.trim(), password, result.token));
      }
      if (req.url === "/api/code") {
        if (!pending || pending.expiresAt <= Date.now() || pending.attempts >= 5) { pending = undefined; throw new Error("Попытка входа истекла. Снова введите логин и пароль"); }
        if (typeof body.code !== "string" || !body.code.trim()) throw new Error("Введите код из почты");
        pending.attempts++;
        const token = await confirm(pending.challengeId, body.code);
        return send(200, await persist(pending.username, pending.password, token));
      }
      if (req.url === "/api/install") {
        const env = await readJson(resolve(directory, "env.json"));
        const result = await install(env);
        return send(200, { message: `Переменные записаны в production проекта ${result.project}. Выполните redeploy, затем включите планировщик.` });
      }
      if (req.url === "/api/cron") {
        const env = await readJson(resolve(directory, "env.json"));
        if (!env.P2POBMEN_AUTH_TOKEN || !env.P2POBMEN_PROCESS_TOKEN) throw new Error("Сначала подтвердите вход p2pobmen");
        let apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
        if (!apiKey) apiKey = await readFile(resolve(directory, "cron-api-key"), "utf8").catch(() => "");
        if (!apiKey) throw new Error("Введите API-ключ cron-job.org из настроек аккаунта");
        const result = await scheduler({ apiKey, processToken: env.P2POBMEN_PROCESS_TOKEN, enabled: body.enabled === true });
        await savePrivate(directory, "cron-api-key", apiKey);
        await savePrivate(directory, "cron-job.json", JSON.stringify(result));
        return send(200, { ...result, message: result.enabled ? "Планировщик включён: запуск каждую минуту." : "Задание создано и пока выключено. После настройки Vercel нажмите «Проверить и включить»." });
      }
      send(404, { error: "Неизвестный шаг" });
    } catch (error) {
      // Only our fixed messages are exposed; never echo request bodies or credentials.
      send(400, { error: error instanceof SyntaxError ? "Некорректный запрос" : error instanceof Error ? error.message : "Шаг не выполнен" });
    } finally { busy = false; }
  });
  return { server, accessToken };
}
