const access = new URLSearchParams(location.hash.slice(1)).get("setup") || "";
history.replaceState(null, "", "/");
const statusElement = document.querySelector("#status");
function message(text, error = false) { statusElement.textContent = text; statusElement.classList.toggle("error", error); }
async function api(path, body) {
  document.querySelectorAll("button").forEach(button => { button.disabled = true; });
  try {
    const response = await fetch(path, { method: body ? "POST" : "GET", headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Шаг не выполнен");
    if (result.message) message(result.message);
    return result;
  } catch (error) { message(error.message, true); throw error; }
  finally { document.querySelectorAll("button").forEach(button => { button.disabled = false; }); }
}
function jobLink(result) {
  if (!result.url) return;
  const link = document.createElement("a"); link.href = result.url; link.target = "_blank"; link.rel = "noreferrer"; link.textContent = "Открыть задание в cron-job.org";
  document.querySelector("#job-link").replaceChildren(link);
}
document.querySelector("#login-form").addEventListener("submit", async event => {
  event.preventDefault();
  try {
    const result = await api("/api/login", { username: document.querySelector("#username").value, password: document.querySelector("#password").value });
    document.querySelector("#password").value = "";
    document.querySelector("#code-form").hidden = result.stage !== "code";
    if (result.stage === "code") document.querySelector("#code").focus();
  } catch { /* The API helper renders a safe error. */ }
});
document.querySelector("#code-form").addEventListener("submit", async event => {
  event.preventDefault();
  try { await api("/api/code", { code: document.querySelector("#code").value }); document.querySelector("#code-form").hidden = true; }
  catch { /* Allow retry with the same challenge. */ }
  finally { document.querySelector("#code").value = ""; }
});
document.querySelector("#install").addEventListener("click", () => { api("/api/install", {}).catch(() => {}); });
async function schedule(enabled) {
  try { const result = await api("/api/cron", { apiKey: document.querySelector("#cron-key").value, enabled }); document.querySelector("#cron-key").value = ""; jobLink(result); }
  catch { /* The API helper renders a safe error. */ }
}
document.querySelector("#cron-form").addEventListener("submit", event => { event.preventDefault(); schedule(false); });
document.querySelector("#enable").addEventListener("click", () => schedule(true));
if (access) api("/api/status").then(result => { message(result.sessionSaved ? "Сессия p2pobmen уже сохранена. Можно продолжить настройку Vercel и планировщика." : "Введите логин и пароль p2pobmen."); jobLink(result.cron); }).catch(() => {});
