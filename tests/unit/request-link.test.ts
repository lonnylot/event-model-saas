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
  it("POST `/api/auth/request-link` returns status 200", async () => {
    const response = await handleRequest(
      requestLinkPost("lonny@lonnylot.com"),
      envWithAssets(),
    );
    expect(response.status).toBe(200);
  });

  it("POST `/api/auth/request-link` returns content-type `application/json; charset=utf-8`", async () => {
    const response = await handleRequest(
      requestLinkPost("lonny@lonnylot.com"),
      envWithAssets(),
    );
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
  });

  it("POST `/api/auth/request-link` returns body `{\"ok\":true,\"message\":\"If you have access, check your inbox.\"}`", async () => {
    const response = await handleRequest(
      requestLinkPost("lonny@lonnylot.com"),
      envWithAssets(),
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

  it("POST `/api/auth/request-link` with `SITE_ADMIN_EMAIL` sends a magic-link mail to that address", async () => {
    const { env, sent } = authEnv();
    await handleRequest(requestLinkPost("lonny@lonnylot.com"), env);
    expect(sent.some((m) => m.to === "lonny@lonnylot.com")).toBe(true);
    expect(sent[0]?.subject).toBe("Sign in to Event Model");
    expect(sent[0]?.text).toContain("/api/auth/consume?token=");
  });

  it("POST `/api/auth/request-link` with an existing Person email sends a magic-link mail to that address", async () => {
    const { env, auth, sent } = authEnv({
      randomId: () => "token-existing",
    });
    await auth.store.insertPerson({
      id: "p-2",
      email: "teammate@example.com",
      isSiteAdmin: false,
    });
    await handleRequest(requestLinkPost("teammate@example.com"), env);
    expect(sent.some((m) => m.to === "teammate@example.com")).toBe(true);
  });

  it("POST `/api/auth/request-link` with an unknown email does not send a magic-link mail to that address", async () => {
    const { env, sent } = authEnv();
    await handleRequest(requestLinkPost("stranger@example.com"), env);
    expect(sent.some((m) => m.to === "stranger@example.com")).toBe(false);
  });

  it("POST `/api/auth/request-link` with an unknown email sends a notify mail to `SITE_ADMIN_EMAIL` whose text includes that address", async () => {
    const { env, sent } = authEnv();
    await handleRequest(requestLinkPost("stranger@example.com"), env);
    const notify = sent.find((m) => m.to === "lonny@lonnylot.com");
    expect(notify).toBeDefined();
    expect(notify?.subject).toBe("Sign-in attempt without an account");
    expect(notify?.text).toContain("stranger@example.com");
  });

  it("POST `/api/auth/request-link` with an unknown email does not insert a waitlist row", async () => {
    const { env, auth } = authEnv();
    await handleRequest(requestLinkPost("stranger@example.com"), env);
    expect(await auth.store.isWaitlisted("stranger@example.com")).toBe(false);
  });

  it("The sixth POST `/api/auth/request-link` for the same email within one hour does not send mail", async () => {
    const { env, sent } = authEnv();
    for (let i = 0; i < 6; i++) {
      await handleRequest(requestLinkPost("lonny@lonnylot.com"), env);
    }
    expect(sent).toHaveLength(5);
  });

  it("The twenty-first POST `/api/auth/request-link` from the same client IP within one hour does not send mail", async () => {
    let n = 0;
    const { env, sent, auth } = authEnv({
      randomId: () => `id-${n++}`,
    });
    for (let i = 0; i < 21; i++) {
      await auth.store.insertPerson({
        id: `p-${i}`,
        email: `person${i}@example.com`,
        isSiteAdmin: false,
      });
      await handleRequest(
        requestLinkPost(`person${i}@example.com`, "198.51.100.9"),
        env,
      );
    }
    expect(sent).toHaveLength(20);
  });
});
