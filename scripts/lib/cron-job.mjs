export const PROCESS_URL = "https://web.curvedlines.ru/api/p2pobmen/process-deals";
export const STATUS_URL = "https://web.curvedlines.ru/api/p2pobmen/status";
const TITLE = "Кривые Линии — p2pobmen, каждую минуту";

function secret(value) {
  if (typeof value !== "string" || !value.trim() || /[\r\n]/.test(value)) throw new Error("Не задан корректный токен");
  return value.trim();
}

export function cronJobPayload(processToken, enabled = false) {
  return {
    title: TITLE, url: PROCESS_URL, enabled, saveResponses: false, requestMethod: 1,
    requestTimeout: 30, redirectSuccess: false,
    schedule: { timezone: "UTC", expiresAt: 0, hours: [-1], minutes: [-1], mdays: [-1], months: [-1], wdays: [-1] },
    extendedData: { headers: { Authorization: `Bearer ${secret(processToken)}`, "X-P2P-Run-Mode": "background" } },
    notification: { onFailure: true, onFailureCount: 3, onSuccess: true, onDisable: true },
  };
}

async function api(apiKey, path, method = "GET", body) {
  let response;
  try {
    response = await fetch(`https://api.cron-job.org${path}`, {
      method, redirect: "error", signal: AbortSignal.timeout(20_000),
      headers: { Authorization: `Bearer ${secret(apiKey)}`, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch { throw new Error("cron-job.org не ответил. Проверьте подключение и повторите попытку"); }
  if (!response.ok) throw new Error(`cron-job.org отклонил запрос (HTTP ${response.status}). Проверьте API-ключ`);
  if (response.status === 204) return {};
  try { return await response.json(); } catch { throw new Error("Некорректный ответ cron-job.org"); }
}

export async function verifyProcessEndpoint(processToken) {
  let response;
  try {
    response = await fetch(STATUS_URL, { headers: { Authorization: `Bearer ${secret(processToken)}` }, redirect: "error", signal: AbortSignal.timeout(25_000) });
  } catch { throw new Error("Сайт не ответил при проверке готовности. Планировщик не включён"); }
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.ok !== true) throw new Error(`Сайт ещё не готов (HTTP ${response.status}). Сначала запишите переменные в Vercel и выполните деплой`);
}

export async function configureCronJob({ apiKey, processToken, enabled = false }) {
  secret(apiKey); secret(processToken);
  // Never enable a schedule against a missing route or an unauthenticated session.
  if (enabled) await verifyProcessEndpoint(processToken);
  const listing = await api(apiKey, "/jobs");
  if (!Array.isArray(listing.jobs) || listing.someFailed) throw new Error("Не удалось получить полный список заданий cron-job.org");
  const matching = listing.jobs.filter(job => job.url === PROCESS_URL && job.title === TITLE);
  if (matching.length > 1) throw new Error("Найдено несколько одинаковых заданий. Оставьте одно в кабинете cron-job.org");
  const job = cronJobPayload(processToken, enabled);
  let jobId = matching[0]?.jobId;
  if (jobId) await api(apiKey, `/jobs/${jobId}`, "PATCH", { job });
  else jobId = (await api(apiKey, "/jobs", "PUT", { job })).jobId;
  if (!Number.isSafeInteger(jobId) || jobId <= 0) throw new Error("cron-job.org не вернул ID задания");
  const saved = (await api(apiKey, `/jobs/${jobId}`)).job;
  const header = name => Object.entries(saved?.extendedData?.headers || {}).find(([key]) => key.toLowerCase() === name.toLowerCase())?.[1];
  if (!saved || saved.url !== PROCESS_URL || saved.enabled !== enabled || saved.requestMethod !== 1 || saved.saveResponses !== false ||
      header("Authorization") !== job.extendedData.headers.Authorization ||
      header("X-P2P-Run-Mode") !== "background" ||
      saved.schedule?.expiresAt !== 0 ||
      !["hours", "minutes", "mdays", "months", "wdays"].every(key => JSON.stringify(saved.schedule?.[key]) === "[-1]")) {
    throw new Error("Сохранённые настройки cron-job.org не совпали с ожидаемыми. Проверьте задание в кабинете");
  }
  return { jobId, enabled, url: `https://console.cron-job.org/jobs/${jobId}` };
}
