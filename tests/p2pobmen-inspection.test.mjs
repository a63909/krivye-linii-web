import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { registerHooks } from "node:module";

registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier === "next/server") return nextResolve(new URL("./next-server.mjs", import.meta.url).href, context);
  try { return nextResolve(specifier, context); } catch (error) {
    if (error.code === "ERR_MODULE_NOT_FOUND" && specifier.startsWith(".") && !/\.[a-z]+$/.test(specifier)) return nextResolve(`${specifier}.ts`, context);
    throw error;
  }
} });
const { inspectionAllowed } = await import("../app/lib/p2pobmen-inspection-access.ts");
const { inspectOwnPaymentMethodReferences } = await import("../app/lib/p2pobmen.ts");
const { GET } = await import("../app/api/p2pobmen/payment-method-inspection/route.ts");
const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });
const ownLotId = "d2618eb1-2833-4b44-ae37-ad8cb64b376b";
const userId = "cccccccc-cccc-cccc-cccc-cccccccccccc";

test("inspection capability rejects incorrect credentials and expires before any API access", async () => {
  const access = { digest: createHash("sha256").update("test-only-capability").digest("hex"), expiresAt: 200 };
  const req = value => new Request("https://example.com/inspect", { headers: value ? { Authorization: `Bearer ${value}` } : {} });
  assert.equal(inspectionAllowed(req("test-only-capability"), access, 100), true);
  assert.equal(inspectionAllowed(req("wrong"), access, 100), false);
  assert.equal(inspectionAllowed(req(), access, 100), false);
  assert.equal(inspectionAllowed(req("test-only-capability"), access, 200), false);
  globalThis.fetch = () => { throw new Error("Unauthorized inspection must not contact API"); };
  const response = await GET(req("wrong"));
  assert.equal(response.status, 404);
  assert.match(response.headers.get("Cache-Control"), /no-store/);
});

function mockInspection(methodIds, { wrongLot = false, missingMethods = false } = {}) {
  process.env.P2POBMEN_AUTH_TOKEN = `test.${Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600, nonce: Math.random() })).toString("base64url")}.signature`;
  const operations = [];
  globalThis.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    operations.push(body.operationName);
    assert.match(String(url), /^https:\/\/p2pobmen\.com\/api\/app\//);
    assert.match(body.query, /^query /);
    assert.equal(options.headers.Authorization, `JWT ${process.env.P2POBMEN_AUTH_TOKEN}`);
    if (body.operationName === "AuthGetUser") return Response.json({ data: { auth: { currentUser: { guid: userId } } } });
    assert.equal(body.operationName, "InspectOwnPaymentMethodReferences");
    assert.deepEqual(body.variables, { lot: { id: ownLotId }, deals: { lotId: ownLotId, userIdSeller: userId, isDeleted: false } });
    assert.match(body.query, /first: 5/);
    assert.doesNotMatch(body.query, /requisites|amount|email|phone|fullName|chat|qrCode/);
    return Response.json({ data: { exchange: {
      lot: { getLot: { id: ownLotId, number: "V0257062", paymentMethods: missingMethods ? null : { edges: [{ node: { id: "method-current" } }] } } },
      deal: { getDeals: { edges: methodIds.map((id, i) => ({ node: {
        id: `deal-${i}`, number: `D${i + 1}`, state: "CANCELLED", lot: { id: wrongLot ? "another-lot" : ownLotId },
        lotPaymentMethod: id ? { id } : null,
      } })), pageInfo: { hasNextPage: true } } },
    } } });
  };
  return operations;
}

test("inspection detects shared references using only the owner's fixed lot", async () => {
  const operations = mockInspection(["method-current", "method-current"]);
  const result = await inspectOwnPaymentMethodReferences();
  assert.equal(result.allSampledDealsShareMethod, true);
  assert.equal(result.distinctDealMethodCount, 1);
  assert.ok(result.deals.every(deal => deal.referencesCurrentLotMethod));
  assert.deepEqual(operations, ["AuthGetUser", "InspectOwnPaymentMethodReferences"]);
  assert.equal(JSON.stringify(result).includes(process.env.P2POBMEN_AUTH_TOKEN), false);
});

test("inspection distinguishes old versions and separate references without claiming editability", async () => {
  mockInspection(["method-old", "method-current"]);
  const result = await inspectOwnPaymentMethodReferences();
  assert.equal(result.allSampledDealsShareMethod, false);
  assert.equal(result.distinctDealMethodCount, 2);
  assert.deepEqual(result.deals.map(deal => deal.referencesCurrentLotMethod), [false, true]);
});

test("inspection refuses incomplete data or deals outside the fixed lot", async () => {
  mockInspection(["method-current"], { wrongLot: true });
  await assert.rejects(inspectOwnPaymentMethodReferences());
  mockInspection(["method-current"], { missingMethods: true });
  await assert.rejects(inspectOwnPaymentMethodReferences());
  mockInspection([null, "method-current"]);
  assert.equal((await inspectOwnPaymentMethodReferences()).allSampledDealsShareMethod, false);
});
