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

function waitlistPost(email: string, ip = "203.0.113.1") {
  return new Request("https://event-model.lonnylot.com/api/waitlist", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cf-connecting-ip": ip,
    },
    body: JSON.stringify({ email }),
  });
}

describe("waitlist", () => {
  it("POST `/api/waitlist` returns status 200", async () => {
    const response = await handleRequest(
      waitlistPost("wait@example.com"),
      envWithAssets(),
    );
    expect(response.status).toBe(200);
  });

  it("POST `/api/waitlist` returns content-type `application/json; charset=utf-8`", async () => {
    const response = await handleRequest(
      waitlistPost("wait@example.com"),
      envWithAssets(),
    );
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
  });

  it('POST `/api/waitlist` returns body `{"ok":true,"message":"If you\'re on the list, we\'ll be in touch."}`', async () => {
    const response = await handleRequest(
      waitlistPost("wait@example.com"),
      envWithAssets(),
    );
    expect(await response.text()).toBe(
      '{"ok":true,"message":"If you\'re on the list, we\'ll be in touch."}',
    );
  });

  it("POST `/api/waitlist` with a new email inserts that email into the waitlist", async () => {
    const { env, auth } = authEnv();
    await handleRequest(waitlistPost("wait@example.com"), env);
    expect(await auth.store.isWaitlisted("wait@example.com")).toBe(true);
  });

  it("POST `/api/waitlist` with a new email sends a waitlist mail to `SITE_ADMIN_EMAIL` whose text includes that address", async () => {
    const { env, sent } = authEnv();
    await handleRequest(waitlistPost("wait@example.com"), env);
    const notify = sent.find((m) => m.to === "lonny@lonnylot.com");
    expect(notify).toBeDefined();
    expect(notify?.text).toContain("wait@example.com");
  });
});




