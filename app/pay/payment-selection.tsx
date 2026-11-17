"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { PaymentEntryResolution, SelectedOrderPayment } from "../lib/existing-order-payment";
import { safePaymentUrl } from "./payment-url";
import styles from "./payment.module.css";

export default function PaymentSelection({ selection, error }: { selection?: SelectedOrderPayment; error?: string }) {
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [available, setAvailable] = useState(selection?.payment.state === "pending");
  const [message, setMessage] = useState(error || selection?.payment.message || "");
  async function pay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selection || !confirmed || busy || !available) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/pay/active?ref=${encodeURIComponent(selection.reference)}`, { cache: "no-store", signal: AbortSignal.timeout(30_000) });
      const result = await response.json() as PaymentEntryResolution;
      if (!response.ok || result.state !== "ready") {
        setMessage(result.message || "Платёж пока недоступен. Обновите статус.");
        setConfirmed(false); setAvailable(false); return;
      }
      if (result.orderLabel !== selection.payment.orderLabel || result.amount !== selection.payment.amount) {
        setMessage("Данные сделки изменились. Обновите статус и ещё раз проверьте номер и сумму.");
        setConfirmed(false); setAvailable(false); return;
      }
      const url = safePaymentUrl(result.confirmationUrl);
      if (!url) throw new Error("Invalid payment URL");
      window.location.assign(url);
    } catch { setMessage("Не удалось открыть оплату. Повторите попытку."); setConfirmed(false); }
    finally { setBusy(false); }
  }
  return <>
    <h1>{selection ? "Проверьте свою сделку" : "Найдите свою сделку"}</h1>
    {selection && <>
      <p className={styles.orderNumber}>Сделка № {selection.payment.orderLabel}</p>
      <p className={styles.amount}>{Number(selection.payment.amount).toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽</p>
      <p className={styles.hint}>ID сделки: {selection.reference}</p>
      <p className={styles.warning}>УБЕДИТЕСЬ, ЧТО ЭТО ИМЕННО ВАША СДЕЛКА. СВЕРЬТЕ НОМЕР И СУММУ С ЧАТОМ ПЛОЩАДКИ.</p>
    </>}
    <p role="status" aria-live="polite">{message}</p>
    {selection && available && <form onSubmit={pay} className={styles.lookup}>
      <label className={styles.confirmation}>
        <input type="checkbox" required checked={confirmed} onChange={event => setConfirmed(event.target.checked)} disabled={busy} />
        <span>Я сверил номер: это моя сделка № {selection.payment.orderLabel} на {Number(selection.payment.amount).toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽.</span>
      </label>
      <button className={styles.button} type="submit" disabled={!confirmed || busy}>{busy ? "Проверяем платёж…" : "Подтвердить и оплатить через СБП"}</button>
    </form>}
    {selection && !available && <button className={styles.secondary} type="button" onClick={() => window.location.reload()}>Обновить статус</button>}
    <Link className={styles.secondary} href="/pay?choose=1" prefetch={false}>Вернуться к выбору сделки</Link>
  </>;
}
