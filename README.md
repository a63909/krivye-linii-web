# Кривые Линии WEB

Production-проект сайта студии для размещения на Vercel.

## Локальный запуск

```bash
npm install
npm run dev
```

## Развёртывание

- `main` — production: `web.curvedlines.ru`
- `preview` — проверка правок: `preview-web.curvedlines.ru`

Vercel автоматически собирает проект после каждого push в GitHub.

## Отправка заявок

Форма на главной странице отправляет заявки через Resend Email API. Корпоративному
ящику не нужен SMTP-доступ: он используется только как получатель.
Секреты задаются только в Vercel → Settings → Environment Variables:

- `RESEND_API_KEY` — секретный API-ключ Resend
- `LEAD_RECIPIENT` — адрес, на который приходят заявки (`web@curvedlines.ru`)
- `LEAD_SENDER` — необязательно; после подтверждения домена можно указать
  `Кривые Линии WEB — заявки <forms@send.curvedlines.ru>`

До подтверждения домена используется `onboarding@resend.dev`. Для первого запуска
аккаунт Resend нужно зарегистрировать на тот же адрес, что указан в
`LEAD_RECIPIENT`.

API-ключ нельзя добавлять в GitHub или `.env.example`.
