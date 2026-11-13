import { createHash } from "node:crypto";

export type DealState = "NEW" | "ACCEPTED" | "PAID" | "PAID_CONFIRMED" | "CLOSED" | "CANCELLED" | "CONFLICT" | "CONFLICT_NEWBIE" | "DEPOSIT";
export type DealNode = {
  id: string;
  number: string | null;
  state: DealState;
  createdAt?: string | null;
  // DealNode.amount is the amount transferred to the seller. amountWithdrawal belongs to LotNode.
  amount: string | number | null;
  amountCurrency: { code: string } | null;
  chat: { id: string } | null;
  dealWithTrustedUser: boolean;
};

export class P2pError extends Error {
  status: number;
  constructor(message: string, status = 502) { super(message); this.status = status; }
}

type Session = { token: string; userId: string; expiresAt: number };
type LoginResult = { token?: string | null; twoFactorIsUsed?: boolean; challengeId?: string | null };
type Envelope<T> = { data?: T; errors?: unknown[] };
let cachedSession: { key: string; promise: Promise<Session> } | undefined;
const fields = "id number state createdAt amount amountCurrency { code } chat { id } dealWithTrustedUser";
const uuidPattern = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;

function requireId(id: string) {
  if (!uuidPattern.test(id)) throw new P2pError("Некорректный ID p2pobmen", 400);
}

async function graphql<T>(operationName: string, query: string, variables: Record<string, unknown>, token?: string): Promise<T> {
  // Use the same operation routes and JWT scheme as the published p2pobmen web client.
  const operationPath = operationName.replace(/(.)?([A-Z])/g, (_, prefix: string, letter: string) => `${prefix ? `${prefix}-` : ""}${letter.toLowerCase()}`);
  let response: Response;
  try {
    response = await fetch(`https://p2pobmen.com/api/app/${operationPath}`, {
      method: "POST", cache: "no-store", redirect: "error",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `JWT ${token}` } : {}) },
      body: JSON.stringify({ operationName, query, variables }), signal: AbortSignal.timeout(8_000),
    });
  } catch { throw new P2pError("p2pobmen не ответил"); }
  if (!response.ok) throw new P2pError("Ошибка HTTP API p2pobmen");
  let result: Envelope<T>;
  try { result = await response.json() as Envelope<T>; } catch { throw new P2pError("Некорректный ответ p2pobmen"); }
  // Do not log provider errors: they can include credentials or private deal data.
  if (!result?.data || result.errors?.length) {
    cachedSession = undefined;
    throw new P2pError("Ошибка GraphQL API p2pobmen");
  }
  return result.data;
}

export async function beginLogin(username: string, password: string): Promise<LoginResult> {
  if (!username || !password) throw new P2pError("Введите логин и пароль p2pobmen", 400);
  const data = await graphql<{ auth?: { login?: LoginResult } }>("AuthLogIn", `mutation AuthLogIn($username: String!, $password: String!) {
    auth { login(username: $username, password: $password) { token twoFactorIsUsed challengeId } }
  }`, { username, password });
  const result = data.auth?.login;
  if (result?.twoFactorIsUsed) {
    if (!result.challengeId) throw new P2pError("p2pobmen не вернул идентификатор подтверждения входа");
    return { twoFactorIsUsed: true, challengeId: result.challengeId };
  }
  if (!result?.token) throw new P2pError("Не удалось войти в p2pobmen", 503);
  return { token: result.token, twoFactorIsUsed: false };
}

export async function completeLogin(challengeId: string, code: string): Promise<string> {
  if (!challengeId || !code.trim()) throw new P2pError("Введите код подтверждения из почты", 400);
  const data = await graphql<{ auth?: { loginWithCode?: { token?: string } } }>("LoginByCode", `mutation LoginByCode($code: String!, $challengeId: String) {
    auth { loginWithCode(code: $code, challengeId: $challengeId) { token } }
  }`, { code: code.trim(), challengeId });
  const token = data.auth?.loginWithCode?.token;
  if (!token) throw new P2pError("Код недействителен или истёк. Повторите вход", 401);
  return token;
}

function tokenExpiry(token: string) {
  // Only a refresh scheduling hint. The provider still verifies the JWT on every request.
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString()) as { exp?: number };
    return typeof payload.exp === "number" && Number.isFinite(payload.exp) ? payload.exp * 1000 : 0;
  } catch { return 0; }
}

async function loadSession(token: string): Promise<Session> {
  let expiresAt = tokenExpiry(token);
  if (expiresAt <= Date.now() + 60_000) {
    try {
      const data = await graphql<{ auth?: { refreshToken?: { token?: string } } }>("AuthRefreshToken", `mutation AuthRefreshToken($token: String!) {
        auth { refreshToken(token: $token) { token } }
      }`, { token });
      const refreshed = data.auth?.refreshToken?.token;
      if (!refreshed) throw new P2pError("Сессия p2pobmen истекла. Выполните вход с кодом из почты", 503);
      token = refreshed;
      expiresAt = tokenExpiry(token);
      if (expiresAt <= Date.now() + 60_000) throw new P2pError("Сессия p2pobmen истекла. Выполните вход с кодом из почты", 503);
    } catch { throw new P2pError("Не удалось обновить сессию p2pobmen. Повторите вход с кодом из почты", 503); }
  }
  const profile = await graphql<{ auth?: { currentUser?: { guid?: string } } }>("AuthGetUser", "query AuthGetUser { auth { currentUser { guid } } }", {}, token);
  const userId = profile.auth?.currentUser?.guid;
  if (!userId || !uuidPattern.test(userId)) throw new P2pError("Не удалось определить продавца p2pobmen");
  return { token, userId, expiresAt: Math.min(expiresAt - 60_000, Date.now() + 4 * 60_000) };
}

export function requireP2pSession() {
  const configuredToken = process.env.P2POBMEN_AUTH_TOKEN?.trim();
  if (!configuredToken) throw new P2pError("Требуется первичный вход p2pobmen с кодом из почты: настройте P2POBMEN_AUTH_TOKEN", 503);
  return configuredToken;
}

async function session(): Promise<Session> {
  const configuredToken = requireP2pSession();
  const key = createHash("sha256").update(configuredToken).digest("hex");
  let token = configuredToken;
  if (cachedSession?.key === key) {
    const current = await cachedSession.promise;
    if (current.expiresAt > Date.now()) return current;
    token = current.token;
  }
  // Cron never performs password login: that could send a new email code every minute.
  const pending = { key, promise: loadSession(token) };
  cachedSession = pending;
  try { return await pending.promise; } catch (error) {
    if (cachedSession === pending) cachedSession = undefined;
    throw error;
  }
}

export async function getMyDeals(states: DealState[] = ["NEW"], first = 15): Promise<DealNode[]> {
  const { token, userId } = await session();
  const data = await graphql<{ exchange?: { deal?: { getDeals?: { edges?: { node: DealNode }[] } } } }>("DealsSallerListLoad", `query DealsSallerListLoad($filter: DealFilter, $first: Int!) {
    exchange { deal { getDeals(filter: $filter, first: $first) { edges { node { ${fields} } } } } }
  }`, { filter: { state: states, userIdSeller: userId, isDeleted: false }, first: Math.max(1, Math.min(15, Math.trunc(first))) }, token);
  const edges = data.exchange?.deal?.getDeals?.edges;
  if (!Array.isArray(edges)) throw new P2pError("Не удалось получить сделки p2pobmen");
  return edges.map(({ node }) => node);
}

export async function getMyDeal(id: string): Promise<DealNode | null> {
  requireId(id);
  const { token, userId } = await session();
  const data = await graphql<{ exchange?: { deal?: { getDeal?: DealNode | null } } }>("P2pGetDeal", `query P2pGetDeal($filter: DealFilter) {
    exchange { deal { getDeal(filter: $filter) { ${fields} } } }
  }`, { filter: { id, userIdSeller: userId, isDeleted: false } }, token);
  const result = data.exchange?.deal?.getDeal;
  if (result === undefined) throw new P2pError("Не удалось проверить сделку p2pobmen");
  return result;
}

export async function acceptDeal(id: string): Promise<DealNode | null> {
  requireId(id);
  const { token } = await session();
  const data = await graphql<{ exchange?: { deal?: { acceptDeal?: { result?: (DealNode & { __typename: string }) | { __typename: string } | null } | null } } }>("SellerDealAccept", `mutation SellerDealAccept($dealId: UUID!) {
    exchange { deal { acceptDeal(dealId: $dealId) { result { __typename ... on DealNode { ${fields} } } } } }
  }`, { dealId: id }, token);
  const result = data.exchange?.deal?.acceptDeal?.result;
  return result?.__typename === "DealNode" ? result as DealNode : null;
}

export async function confirmPaymentRecieve(id: string): Promise<DealNode | null> {
  requireId(id);
  const { token } = await session();
  const data = await graphql<{ exchange?: { deal?: { confirmPaymentRecieve?: DealNode | null } } }>("PaidSellerDealAccept", `mutation PaidSellerDealAccept($id: UUID!) {
    exchange { deal { confirmPaymentRecieve(dealId: $id) { ${fields} } } }
  }`, { id }, token);
  const result = data.exchange?.deal?.confirmPaymentRecieve;
  if (result === undefined) throw new P2pError("Не удалось подтвердить сделку p2pobmen");
  return result;
}

export async function sendChatMessage(chatId: string, message: string): Promise<void> {
  requireId(chatId);
  const { token } = await session();
  const data = await graphql<{ chat?: { createChatMessage?: { id?: string } } }>("ChatCreateMessage", `mutation ChatCreateMessage($input: ChatMessageCreateInput) {
    chat { createChatMessage(input: $input) { id } }
  }`, { input: { chatId, message } }, token);
  if (!data.chat?.createChatMessage?.id) throw new P2pError("Не удалось отправить сообщение p2pobmen");
}

export function p2pError(error: unknown) {
  return { status: error instanceof P2pError ? error.status : 500, message: error instanceof P2pError ? error.message : "Ошибка обработки сделки p2pobmen" };
}

export async function hasSellerChatMessage(chatId: string, message: string): Promise<boolean> {
  requireId(chatId);
  const { token, userId } = await session();
  // Only the seller's own undeleted message acknowledges link delivery.
  const data = await graphql<{ chat?: { getChat?: { chatMessages?: {
    edges?: { node: { message?: string; isDeleted?: boolean; isSystem?: boolean; user?: { guid?: string } } }[];
    pageInfo?: { hasNextPage?: boolean; hasPreviousPage?: boolean };
  } } | null } }>("ChatLoad",
    "query ChatLoad($id: UUID!) { chat { getChat(id: $id) { chatMessages { edges { node { message isDeleted isSystem user { guid } } } pageInfo { hasNextPage hasPreviousPage } } } } }",
    { id: chatId }, token);
  const messages = data.chat?.getChat?.chatMessages;
  if (!Array.isArray(messages?.edges)) throw new P2pError("Не удалось проверить доставку ссылки в чат");
  if (messages.edges.some(({ node }) => node?.user?.guid === userId && node.isDeleted === false && node.isSystem === false && node.message === message)) return true;
  if (messages.pageInfo?.hasNextPage !== false || messages.pageInfo?.hasPreviousPage !== false) throw new P2pError("История чата неполная: требуется проверка доставки ссылки", 409);
  return false;
}
