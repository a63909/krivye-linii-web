# ЮKassa: динамические ссылки СБП для консультаций

Покупатель не вводит сумму. После согласования стоимости внутренний агент вызывает защищённый серверный метод. Сервер создаёт платёж СБП в ЮKassa и возвращает персональную ссылку. На компьютере ЮKassa показывает QR, на телефоне — список банков.

## Переменные окружения

```env
YOOKASSA_SHOP_ID=1515932
YOOKASSA_SECRET_KEY=
PUBLIC_SITE_URL=https://web.curvedlines.ru
CONSULTATION_PAYMENT_API_TOKEN=
PAYMENT_LINK_SIGNING_SECRET=
CONSULTATION_PAYMENT_STATUS_URL=
CONSULTATION_PAYMENT_STATUS_TOKEN=
```

`YOOKASSA_SECRET_KEY`, `CONSULTATION_PAYMENT_API_TOKEN` и `PAYMENT_LINK_SIGNING_SECRET` должны храниться только на сервере. Их нельзя добавлять в клиентский код, переписку или Git.

## Создание ссылки

Внутренний агент отправляет согласованную сумму и ID реальной заявки:

```http
POST /api/yookassa/consultation-payment
Authorization: Bearer <CONSULTATION_PAYMENT_API_TOKEN>
Content-Type: application/json

{
  "consultationId": "consult-2026-000123",
  "amount": "920.00"
}
```

Ответ:

```json
{
  "ok": true,
  "consultationId": "consult-2026-000123",
  "amount": "920.00",
  "paymentId": "...",
  "status": "pending",
  "checkoutUrl": "https://web.curvedlines.ru/consultation/checkout/...",
  "expiresAt": "..."
}
```

Клиенту отправляется только `checkoutUrl`. Сумма уже записана в платеже, изменить её на странице оплаты нельзя. Ссылка подписана и действует один час.

## HTTP-уведомления

В кабинете ЮKassa укажите:

```text
https://web.curvedlines.ru/api/yookassa/webhook
```

События: `payment.succeeded` и `payment.canceled`.

Обработчик повторно получает платёж через API ЮKassa, поэтому не доверяет данным входящего запроса без проверки. Если задан `CONSULTATION_PAYMENT_STATUS_URL`, проверенный статус передаётся внутреннему агенту.

## Запуск

1. Дождаться завершения проверки и подписания договора ЮKassa.
2. Выпустить секретный ключ магазина.
3. Добавить серверные переменные окружения.
4. Настроить HTTP-уведомления.
5. Сначала проверить сценарий на тестовом магазине.
6. После теста переключить `YOOKASSA_SHOP_ID` и `YOOKASSA_SECRET_KEY` на боевые.
