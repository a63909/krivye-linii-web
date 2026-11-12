import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, stat, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { once } from "node:events";
import { cronJobPayload, configureCronJob, PROCESS_URL, STATUS_URL } from "../scripts/lib/cron-job.mjs";
import { createSetupServer } from "../scripts/lib/p2pobmen-setup.mjs";

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

test("cron-job.org gets a minutely POST with a dedicated token and no response retention", () => {
  const job = cronJobPayload("process-only-token");
  assert.equal(job.enabled, false);
  assert.equal(job.url, PROCESS_URL);
  assert.equal(job.requestMethod, 1);
  assert.equal(job.requestTimeout, 30);
  assert.equal(job.saveResponses, false);
  assert.equal(job.extendedData.headers.Authorization, "Bearer process-only-token");
  assert.equal(job.extendedData.headers["X-P2P-Run-Mode"], "background");
  for (const key of ["hours", "minutes", "mdays", "months", "wdays"]) assert.deepEqual(job.schedule[key], [-1]);
  assert.throws(() => cronJobPayload("token\r\ninjected: value"));
});

test("scheduler provisioning reuses the same job and enables it only after readiness", async () => {
  let job;
  let creates = 0;
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url, options });
    if (url === STATUS_URL) {
      assert.equal(options.headers.Authorization, "Bearer process-only-token");
      return Response.json({ ok: true });
    }
    assert.equal(options.headers.Authorization, "Bearer cron-api-key");
    assert.ok(url.startsWith("https://api.cron-job.org/"));
    if (options.method === "PUT") { job = JSON.parse(options.body).job; creates++; return Response.json({ jobId: 123 }); }
    if (options.method === "PATCH") { job = JSON.parse(options.body).job; return Response.json({}); }
    if (url.endsWith("/jobs")) return Response.json({ jobs: job ? [{ ...job, jobId: 123 }] : [], someFailed: false });
    return Response.json({ job });
  };
  assert.equal((await configureCronJob({ apiKey: "cron-api-key", processToken: "process-only-token" })).enabled, false);
  assert.equal(calls.some(call => call.url === STATUS_URL), false);
  const beforeEnable = calls.length;
  const result = await configureCronJob({ apiKey: "cron-api-key", processToken: "process-only-token", enabled: true });
  assert.equal(calls[beforeEnable].url, STATUS_URL);
  assert.equal(result.enabled, true);
  assert.equal(creates, 1);
  assert.equal(job.enabled, true);
  assert.equal(JSON.stringify(result).includes("process-only-token"), false);
  assert.equal(JSON.stringify(result).includes("cron-api-key"), false);
});

test("a missing or unauthenticated production route cannot enable the schedule", async () => {
  const calls = [];
  globalThis.fetch = async url => { calls.push(url); return Response.json({ ok: false }, { status: 503 }); };
  await assert.rejects(configureCronJob({ apiKey: "key", processToken: "process-only-token", enabled: true }), /Сайт ещё не готов/);
  assert.deepEqual(calls, [STATUS_URL]);
});

test("an incomplete provider job list cannot create a duplicate schedule", async () => {
  globalThis.fetch = async () => Response.json({ jobs: [], someFailed: true });
  await assert.rejects(configureCronJob({ apiKey: "key", processToken: "token" }), /полный список/);
});

test("the local form protects setup, completes email challenge, and never returns secrets", async () => {
  const directory = await mkdtemp(join(tmpdir(), "p2p-setup-test-"));
  const calls = [];
  const { server, accessToken } = await createSetupServer({
    directory,
    login: async (username, password) => { calls.push({ username, password }); return { twoFactorIsUsed: true, challengeId: "private-challenge" }; },
    confirm: async (challengeId, code) => { assert.equal(challengeId, "private-challenge"); assert.equal(code, "123456"); return "private-session-token"; },
    install: async env => { assert.equal(env.P2POBMEN_AUTH_TOKEN, "private-session-token"); return { project: "krivye-linii-web" }; },
    scheduler: async options => { assert.equal(options.apiKey, "private-cron-key"); return { jobId: 1, enabled: options.enabled, url: "https://console.cron-job.org/jobs/1" }; },
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const origin = `http://127.0.0.1:${server.address().port}`;
  const call = (path, body, headers = {}) => originalFetch(origin + path, {
    method: body ? "POST" : "GET", headers: { Authorization: `Bearer ${accessToken}`, Origin: origin, "Content-Type": "application/json", ...headers }, body: body ? JSON.stringify(body) : undefined,
  });
  try {
    const page = await originalFetch(origin);
    assert.equal(page.headers.get("cache-control"), "no-store");
    assert.match(page.headers.get("content-security-policy"), /frame-ancestors 'none'/);
    const html = await page.text();
    assert.match(html, /id="password"[^>]+type="password"/);
    assert.match(html, /id="code"[^>]+type="password"/);
    assert.match(html, /id="cron-key"[^>]+type="password"/);
    assert.equal((await originalFetch(origin + "/api/status")).status, 401);
    assert.equal((await call("/api/login", { username: "seller", password: "private-password" }, { Origin: "https://other.example" })).status, 403);
    assert.equal(calls.length, 0);
    const login = await call("/api/login", { username: "seller", password: "private-password" });
    const loginText = await login.text();
    assert.equal(JSON.parse(loginText).stage, "code");
    assert.doesNotMatch(loginText, /private-password|private-challenge/);
    const confirmed = await call("/api/code", { code: "123456" });
    const text = await confirmed.text();
    assert.equal(JSON.parse(text).stage, "saved");
    assert.doesNotMatch(text, /private-password|private-session-token|123456/);
    const env = JSON.parse(await readFile(join(directory, "env.json"), "utf8"));
    assert.equal(env.P2POBMEN_USERNAME, "seller");
    assert.equal(env.P2POBMEN_PASSWORD, "private-password");
    assert.equal(env.P2POBMEN_AUTH_TOKEN, "private-session-token");
    assert.ok(env.P2POBMEN_PROCESS_TOKEN.length >= 32);
    if (process.platform !== "win32") assert.equal((await stat(join(directory, "env.json"))).mode & 0o777, 0o600);
    const status = await (await call("/api/status")).text();
    assert.equal(JSON.parse(status).sessionSaved, true);
    assert.doesNotMatch(status, /private-password|private-session-token/);
    assert.equal((await call("/api/install", {})).status, 200);
    const prepared = await (await call("/api/cron", { apiKey: "private-cron-key", enabled: false })).json();
    assert.equal(prepared.enabled, false);
    const enabled = await (await call("/api/cron", { enabled: true })).json();
    assert.equal(enabled.enabled, true);
    assert.doesNotMatch(JSON.stringify(enabled), /private-cron-key/);
  } finally {
    await new Promise(resolve => server.close(resolve));
    await rm(directory, { recursive: true, force: true });
  }
});
