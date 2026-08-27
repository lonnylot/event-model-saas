import type { AuthRuntime } from "./types";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

export const EXPIRED_HEADING = "This link is expired or already used.";

export function expiredLinkHtml(): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="/shell.css"></head><body class="expired"><main><h1>${EXPIRED_HEADING}</h1></main></body></html>`;
}

export async function consumeLink(
  runtime: AuthRuntime,
  token: string,
  requestUrl: URL,
): Promise<Response> {
  const now = runtime.now();
  const link = token ? await runtime.store.getMagicLink(token) : null;
  const invalid =
    !link || link.usedAt !== null || link.expiresAt <= now;
  if (invalid) {
    return new Response(expiredLinkHtml(), {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  await runtime.store.markMagicLinkUsed(token, now);
  const sessionId = runtime.randomId();
  await runtime.store.insertSession({
    id: sessionId,
    personId: link.personId,
    expiresAt: now + SESSION_TTL_MS,
  });
  const secure = requestUrl.protocol === "https:" ? "; Secure" : "";
  const cookie = `session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}${secure}`;
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/app",
      "Set-Cookie": cookie,
    },
  });
}
