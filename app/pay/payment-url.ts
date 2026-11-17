export function safePaymentUrl(value: unknown) {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !url.username && !url.password && !url.port && ["yoomoney.ru", "yookassa.ru", "qr.nspk.ru"].includes(url.hostname)) return url.toString();
  } catch { /* An invalid response must never navigate to another website. */ }
  return undefined;
}
