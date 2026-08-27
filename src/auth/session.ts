import type { AuthRuntime, Person } from "./types";

export function readSessionId(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === "session") return rest.join("=");
  }
  return null;
}

export function clearSessionCookie(): string {
  return "session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
}

export async function personFromRequest(
  runtime: AuthRuntime,
  request: Request,
): Promise<Person | null> {
  const id = readSessionId(request.headers.get("Cookie"));
  if (!id) return null;
  const session = await runtime.store.getSession(id);
  if (!session || session.expiresAt <= runtime.now()) return null;
  return runtime.store.getPersonById(session.personId);
}

export function appPageHtml(email: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="/shell.css"></head><body class="app-guest"><main><p>${email}</p><form method="post" action="/api/auth/sign-out"><button type="submit">Sign out</button></form></main></body></html>`;
}
