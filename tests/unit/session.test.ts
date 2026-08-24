import { describe, expect, it, vi } from "vitest";
import { createMemoryStore } from "../../src/auth/memory-store.ts";
import type { AuthRuntime } from "../../src/auth/types.ts";
import { handleRequest } from "../../src/index.ts";

function authEnv() {
  const store = createMemoryStore();
  const auth: AuthRuntime = {
    store,
    mail: { async send() {} },
    now: () => 1_700_000_000_000,
    randomId: () => "sess-1",
    siteAdminEmail: "lonny@lonnylot.com",
    authFrom: "auth@event-model.lonnylot.com",
  };
  return { env: { ASSETS: { fetch: vi.fn() }, auth }, auth };
}

async function signedIn() {
  const ctx = authEnv();
  await ctx.auth.store.insertPerson({
    id: "p-1",
    email: "lonny@lonnylot.com",
    isSiteAdmin: true,
  });
  await ctx.auth.store.insertSession({
    id: "sess-1",
    personId: "p-1",
    expiresAt: ctx.auth.now() + 60_000,
  });
  return ctx;
}

describe("signed-in app", () => {
  it("GET `/app` without a Session returns status 303", async () => {
    const { env } = authEnv();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app"),
      env,
    );
    expect(response.status).toBe(303);
  });

  it("GET `/app` without a Session sets `Location` to `/`", async () => {
    const { env } = authEnv();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app"),
      env,
    );
    expect(response.headers.get("Location")).toBe("/");
  });

  it("GET `/app` with a Session that is not redirected shows the Person's email", async () => {
    const { env } = await signedIn();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app", {
        headers: { Cookie: "session=sess-1" },
      }),
      env,
    );
    expect(await response.text()).toContain("lonny@lonnylot.com");
  });

  it("GET `/app` with a Session that is not redirected shows a button whose accessible name is `Sign out`", async () => {
    const { env } = await signedIn();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app", {
        headers: { Cookie: "session=sess-1" },
      }),
      env,
    );
    expect(await response.text()).toContain("<button type=\"submit\">Sign out</button>");
  });

  it("POST `/api/auth/sign-out` with a Session returns status 303", async () => {
    const { env } = await signedIn();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/api/auth/sign-out", {
        method: "POST",
        headers: { Cookie: "session=sess-1" },
      }),
      env,
    );
    expect(response.status).toBe(303);
  });

  it("POST `/api/auth/sign-out` with a Session sets `Location` to `/`", async () => {
    const { env } = await signedIn();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/api/auth/sign-out", {
        method: "POST",
        headers: { Cookie: "session=sess-1" },
      }),
      env,
    );
    expect(response.headers.get("Location")).toBe("/");
  });

  it("POST `/api/auth/sign-out` clears the Session cookie", async () => {
    const { env } = await signedIn();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/api/auth/sign-out", {
        method: "POST",
        headers: { Cookie: "session=sess-1" },
      }),
      env,
    );
    const cookie = response.headers.get("Set-Cookie") ?? "";
    expect(cookie.startsWith("session=")).toBe(true);
    expect(cookie).toContain("Max-Age=0");
  });
});
