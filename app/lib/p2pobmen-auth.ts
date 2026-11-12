import { constantEqual, requireInternalAuth } from "./yookassa";

export function requireProcessAuth(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const processToken = process.env.P2POBMEN_PROCESS_TOKEN;
  if (processToken && constantEqual(authorization, `Bearer ${processToken}`)) return;
  // Compatibility for installations that previously used Vercel Cron.
  const legacySecret = process.env.CRON_SECRET;
  if (request.method === "GET" && legacySecret && constantEqual(authorization, `Bearer ${legacySecret}`)) return;
  requireInternalAuth(request);
}
