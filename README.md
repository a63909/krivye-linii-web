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

Форма на главной странице отправляет заявки через SMTP корпоративного ящика.
Секреты задаются только в Vercel → Settings → Environment Variables:

- `SMTP_HOST` — `smtp.mail.ru`
- `SMTP_PORT` — `465`
- `SMTP_USER` — корпоративный адрес отправителя
- `SMTP_PASSWORD` — пароль внешнего приложения с правом отправки почты
- `LEAD_RECIPIENT` — адрес, на который приходят заявки

Пароль почтового ящика нельзя добавлять в GitHub или `.env.example`.

