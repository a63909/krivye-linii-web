import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type LeadPayload = {
  name?: unknown;
  contact?: unknown;
  project?: unknown;
  budget?: unknown;
  details?: unknown;
  company?: unknown;
};

const normalize = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректные данные" }, { status: 400 });
  }

  const company = normalize(payload.company, 120);
  if (company) return NextResponse.json({ ok: true });

  const name = normalize(payload.name, 120);
  const contact = normalize(payload.contact, 180);
  const project = normalize(payload.project, 120);
  const budget = normalize(payload.budget, 120);
  const details = normalize(payload.details, 3000);

  if (name.length < 2 || contact.length < 3) {
    return NextResponse.json(
      { ok: false, error: "Укажите имя и контакт" },
      { status: 400 },
    );
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const recipient = process.env.LEAD_RECIPIENT || smtpUser;

  if (!smtpUser || !smtpPassword || !recipient) {
    console.error("[lead] SMTP environment is not configured");
    return NextResponse.json(
      { ok: false, error: "Отправка временно недоступна" },
      { status: 503 },
    );
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.mail.ru",
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  const safeName = escapeHtml(name);
  const safeContact = escapeHtml(contact);
  const safeProject = escapeHtml(project || "Не указан");
  const safeBudget = escapeHtml(budget || "Не указан");
  const safeDetails = escapeHtml(details || "Не указана").replaceAll("\n", "<br />");

  try {
    await transport.sendMail({
      from: `"Кривые Линии WEB — заявки" <${smtpUser}>`,
      to: recipient,
      replyTo: isEmail(contact) ? contact : undefined,
      subject: `Новая заявка: ${project || "проект"} — ${name}`,
      text: [
        `Имя: ${name}`,
        `Контакт: ${contact}`,
        `Тип проекта: ${project || "Не указан"}`,
        `Бюджет: ${budget || "Не указан"}`,
        "",
        "Задача:",
        details || "Не указана",
      ].join("\n"),
      html: `
        <h2>Новая заявка с web.curvedlines.ru</h2>
        <p><strong>Имя:</strong> ${safeName}</p>
        <p><strong>Контакт:</strong> ${safeContact}</p>
        <p><strong>Тип проекта:</strong> ${safeProject}</p>
        <p><strong>Бюджет:</strong> ${safeBudget}</p>
        <p><strong>Задача:</strong><br />${safeDetails}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[lead] SMTP delivery failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { ok: false, error: "Не удалось отправить заявку" },
      { status: 502 },
    );
  }
}
