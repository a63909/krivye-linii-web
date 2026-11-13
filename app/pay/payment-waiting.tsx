"use client";

import { useEffect, useState } from "react";
import type { PaymentEntryResolution } from "../lib/existing-order-payment";
import styles from "./payment.module.css";

function safePaymentUrl(value: unknown) {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !url.username && !url.password && !url.port && ["yoomoney.ru", "yookassa.ru", "qr.nspk.ru"].includes(url.hostname)) return url.toString();
  } catch { /* An invalid response must never navigate to another website. */ }
  return undefined;
}

export default function PaymentWaiting({ initial, reference }: { initial: PaymentEntryResolution; reference?: string }) {
  const [result, setResult] = useState(initial);
  const [cycle, setCycle] = useState(0);
  const [stopped, setStopped] = useState(!initial.retryable);

  useEffect(() => {
    if (!initial.retryable && cycle === 0) return;
    let canceled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const controller = new AbortController();
    const deadline = Date.now() + 90_000;
    const endpoint = reference ? `/api/pay/active?ref=${encodeURIComponent(reference)}` : "/api/pay/active";
    async function check() {
      let again = true;
      try {
        const response = await fetch(endpoint, { cache: "no-store", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(30_000)]) });
        const next = await response.json() as PaymentEntryResolution;
        if (canceled) return;
        if (!next || !["ready", "waiting", "blocked"].includes(next.state)) throw new Error("Invalid payment response");
        if (response.ok && next.state === "ready") {
          const url = safePaymentUrl(next.confirmationUrl);
          if (!url) throw new Error("Invalid payment URL");
          window.location.replace(url);
          return;
        }
        setResult(next);
        again = response.status >= 500 || next.retryable === true;
      } catch {
        if (canceled) return;
        setResult({ state: "waiting", retryable: true, message: "Проверяем готовность платежа. Если соединение прервалось, повторим попытку автоматически." });
      }
      if (canceled) return;
      if (again && Date.now() < deadline) timer = setTimeout(check, 5_000);
      else setStopped(true);
    }
    timer = setTimeout(check, cycle ? 0 : 3_000);
    return () => { canceled = true; controller.abort(); if (timer) clearTimeout(timer); };
  }, [reference, cycle, initial.retryable]);

  return <>
    <h1>{result.state === "blocked" ? "Оплата заявки" : "Готовим оплату"}</h1>
    <p role="status" aria-live="polite">{result.message}</p>
    {!stopped && <p>Как только платёж будет готов, откроется выбор банка. Сумму вводить не нужно.</p>}
    {stopped && <button className={styles.button} type="button" onClick={() => { setStopped(false); setCycle(value => value + 1); }}>Проверить ещё раз</button>}
  </>;
}
