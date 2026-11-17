import { createHash, timingSafeEqual } from "node:crypto";

// The random capability itself is kept only in the operator's temporary process.
// Only its digest is deployed; this access expires even if cleanup is delayed.
export const inspectionAccess = {
  digest: "9ebff4d363e90f5c12d1ed4392d38e85d3994d7503b4e3ddb510a491050e4a53",
  expiresAt: Date.parse("2026-11-17T10:50:33.145Z"),
};

export function inspectionAllowed(request: Request, access = inspectionAccess, now = Date.now()) {
  if (!Number.isFinite(access.expiresAt) || now >= access.expiresAt || !/^[a-f0-9]{64}$/.test(access.digest)) return false;
  const authorization = request.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ") || authorization.length > 200) return false;
  const actual = createHash("sha256").update(authorization.slice(7)).digest();
  return timingSafeEqual(actual, Buffer.from(access.digest, "hex"));
}
