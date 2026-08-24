import { describe, expect, it, vi } from "vitest";
import { createMemoryStore } from "../../src/auth/memory-store.ts";
import type { AuthRuntime, MailMessage } from "../../src/auth/types.ts";
import { handleRequest } from "../../src/index.ts";

function envWithAssets() {
  return { ASSETS: { fetch: vi.fn() } };
}

function recordingMail(): { mail: AuthRuntime["mail"]; sent: MailMessage[] } {
  const sent: MailMessage[] = [];
  return {
    sent,
    mail: {
      async send(message) {
        sent.push(message);
      },
    },
  };
}

function authEnv(overrides: Partial<AuthRuntime> = {}) {
  const { mail, sent } = recordingMail();
  const store = createMemoryStore();
  const auth: AuthRuntime = {
    store,
    mail,
    now: () => 1_700_000_000_000,
    randomId: () => "id-1",
    siteAdminEmail: "lonny@lonnylot.com",
    authFrom: "auth@event-model.lonnylot.com",
    ...overrides,
  };
  return { env: { ...envWithAssets(), auth }, auth, sent };
}

function requestLinkPost(email: string, ip = "203.0.113.1") {
  return new Request("https://event-model.lonnylot.com/api/auth/request-link", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cf-connecting-ip": ip,
    },
    body: JSON.stringify({ email }),
  });
}

describe("request-link", () => {
  it("POST `/api/auth/request-link` returns status 200, content-type `application/json; charset=utf-8`, and body `{\"ok\":true,\"message\":\"If you have access, check your inbox.\"}`", async () => {
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/api/auth/request-link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "lonny@lonnylot.com" }),
      }),
      envWithAssets(),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
    expect(await response.text()).toBe(
      '{"ok":true,"message":"If you have access, check your inbox."}',
    );
  });

  it("POST `/api/auth/request-link` with `SITE_ADMIN_EMAIL` when no Person exists creates the site admin Person", async () => {
    const { env, auth } = authEnv();
    await handleRequest(
      requestLinkPost("lonny@lonnylot.com"),
      env,
    );
    const person = await auth.store.getPersonByEmail("lonny@lonnylot.com");
    expect(person).not.toBeNull();
    expect(person?.isSiteAdmin).toBe(true);
  });
});
