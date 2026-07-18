import { NextResponse } from "next/server";

export const runtime = "nodejs";

const RESEND_API_URL = "https://api.resend.com/emails";

type LeadPayload = {
  name?: unknown;
  contact?: unknown;
  project?: unknown;
  budget?: unknown;
  details?: unknown;
  startedAt?: unknown;
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

  const startedAt =
    typeof payload.startedAt === "number"
      ? payload.startedAt
      : Number(payload.startedAt);
  const fillTime = Date.now() - startedAt;

  if (!Number.isFinite(startedAt) || fillTime < 750 || fillTime > 86_400_000) {
    return NextResponse.json(
      { ok: false, error: "Обновите страницу и повторите отправку" },
      { status: 400 },
    );
  }

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

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.LEAD_RECIPIENT || "web@curvedlines.ru";
  const sender =
    process.env.LEAD_SENDER ||
    "Кривые Линии WEB — заявки <onboarding@resend.dev>";

  if (!apiKey || !recipient) {
    console.error("[lead] Email API environment is not configured");
    return NextResponse.json(
      { ok: false, error: "Отправка временно недоступна" },
      { status: 503 },
    );
  }

  const safeName = escapeHtml(name);
  const safeContact = escapeHtml(contact);
  const safeProject = escapeHtml(project || "Не указан");
  const safeBudget = escapeHtml(budget || "Не указан");
  const safeDetails = escapeHtml(details || "Не указана").replaceAll("\n", "<br />");

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: isEmail(contact) ? contact : undefined,
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
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      const providerError = await response.text();
      console.error(
        "[lead] Email API rejected request",
        response.status,
        providerError.slice(0, 500),
      );
      throw new Error(`Email API returned ${response.status}`);
    }

    const providerResult = (await response.json().catch(() => null)) as
      | { id?: string }
      | null;
    console.info("[lead] Resend accepted message", {
      id: providerResult?.id || "unknown",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "[lead] Email API delivery failed",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      { ok: false, error: "Не удалось отправить заявку" },
      { status: 502 },
    );
  }
}
