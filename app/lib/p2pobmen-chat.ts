import type { DealNode } from "./p2pobmen";

// The platform renders plain text with white-space: normal: blank lines collapse.
// Separate messages keep the deal information and backup URL visibly isolated.
export function paymentChatMessages(deal: Pick<DealNode, "id" | "number">, amount: string, paymentLink: string): string[] {
  const number = deal.number || deal.id;
  return [
    "💳 Оплата по сделке #" + number + "\nСумма: " + amount + " ₽\n\n" +
      "🔴 ЗАПОМНИТЕ НОМЕР ВАШЕЙ СДЕЛКИ: " + number + " 🔴",
    "Для оплаты нажмите ссылку под QR-кодом в разделе «Данные получателя».\n\n" +
      "ЕСЛИ ОТКРЫЛСЯ СПИСОК, ВЫБЕРИТЕ ИМЕННО СВОЮ СДЕЛКУ № " + number + " И ПРОВЕРЬТЕ СУММУ " + amount + " ₽. НЕ ВЫБИРАЙТЕ ТОЛЬКО ПО СУММЕ.\n\n" +
      "Выберите банк — сумма уже указана. После успешной оплаты сделка будет подтверждена автоматически.\n\n" +
      "Запасная персональная ссылка для вашей сделки — в следующем сообщении. Скопируйте ссылку ниже и откройте её в браузере.",
    paymentLink,
  ];
}
