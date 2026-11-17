"use client";

import { useState } from "react";
import Link from "next/link";
import type { PaymentEntryResolution } from "../lib/existing-order-payment";
import styles from "./payment.module.css";

export default function PaymentChoices({ initial }: { initial: PaymentEntryResolution }) {
  const [result, setResult] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function refresh() {
    setBusy(true); setError("");
    try {
      // Once the chooser is shown, refreshing must never auto-select the last
      // remaining deal when other buyers finish paying.
      const response = await fetch("/api/pay/active?choose=1", { cache: "no-store", signal: AbortSignal.timeout(30_000) });
      const next = await response.json() as PaymentEntryResolution;
      if (!response.ok || next.state !== "choose" || !Array.isArray(next.choices)) throw new Error("Invalid choices");
      setResult(next);
    } catch { setError("Не удалось обновить список. Повторите попытку."); }
    finally { setBusy(false); }
  }
  return <>
    <h1>Выберите свою сделку</h1>
    <p className={styles.warning}>СВЕРЬТЕ НОМЕР СДЕЛКИ С ЧАТОМ ПЛОЩАДКИ. НЕ ВЫБИРАЙТЕ ТОЛЬКО ПО СУММЕ.</p>
    <p>{result.message}</p>
    <form action="/pay/choose" method="get" className={styles.lookup}>
      <label htmlFor="payment-order">Номер сделки или полный ID</label>
      <input id="payment-order" name="order" required maxLength={80} placeholder="Например, D1097367" autoComplete="off" spellCheck={false} />
      <button className={styles.button} type="submit">Найти мою сделку</button>
    </form>
    <ul className={styles.choices} aria-label="Ожидающие сделки">
      {(result.choices || []).map(choice => <li key={choice.reference}>
        <Link className={styles.choice} href={`/pay/choose?order=${encodeURIComponent(choice.reference)}`} prefetch={false}>
          <strong>Сделка № <span className={styles.dealNumber}>{choice.orderLabel}</span></strong>
          <span className={styles.choiceAmount}>{Number(choice.amount).toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽</span>
          <small>ID сделки: {choice.reference}</small>
          <span className={styles.choiceAction}>{choice.checkingPayment ? "Проверить статус оплаты" : "Выбрать и проверить →"}</span>
        </Link>
      </li>)}
    </ul>
    <p className={styles.hint}>Показано до 15 ожидающих сделок. Если вашей нет в списке, найдите её по номеру или ID выше.</p>
    {error && <p role="alert">{error}</p>}
    <button className={styles.secondary} type="button" disabled={busy} onClick={refresh}>{busy ? "Обновляем…" : "Обновить список"}</button>
  </>;
}
