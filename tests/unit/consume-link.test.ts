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
  return {
    env: { ASSETS: { fetch: vi.fn() }, auth },
    auth,
  };
}

async function seedLink(
  auth: AuthRuntime,
  opts: { usedAt?: number | null; expiresAt?: number } = {},
) {
  await auth.store.insertPerson({
    id: "p-1",
    email: "lonny@lonnylot.com",
    isSiteAdmin: true,
  });
  await auth.store.insertMagicLink({
    token: "tok-1",
    personId: "p-1",
    expiresAt: opts.expiresAt ?? auth.now() + 60_000,
    usedAt: opts.usedAt === undefined ? null : opts.usedAt,
  });
}

function consume(url: string) {
  return new Request(url, { method: "GET" });
}

describe("consume-link", () => {
  it("GET `/api/auth/consume` with a valid unused magic-link token returns status 303", async () => {
    const { env, auth } = authEnv();
    await seedLink(auth);
    const response = await handleRequest(
      consume(
        "https://event-model.lonnylot.com/api/auth/consume?token=tok-1",
      ),
      env,
    );
    expect(response.status).toBe(303);
  });

  it("GET `/api/auth/consume` with a valid unused magic-link token sets `Location` to `/app`", async () => {
    const { env, auth } = authEnv();
    await seedLink(auth);
    const response = await handleRequest(
      consume(
        "https://event-model.lonnylot.com/api/auth/consume?token=tok-1",
      ),
      env,
    );
    expect(response.headers.get("Location")).toBe("/app");
  });

  it("GET `/api/auth/consume` with a valid unused magic-link token sets a Session cookie named `session` that includes `HttpOnly`", async () => {
    const { env, auth } = authEnv();
    await seedLink(auth);
    const response = await handleRequest(
      consume(
        "https://event-model.lonnylot.com/api/auth/consume?token=tok-1",
      ),
      env,
    );
    const cookie = response.headers.get("Set-Cookie") ?? "";
    expect(cookie.startsWith("session=")).toBe(true);
    expect(cookie).toContain("HttpOnly");
  });

  it("GET `/api/auth/consume` with a valid unused magic-link token over https sets a Session cookie that includes `Secure`", async () => {
    const { env, auth } = authEnv();
    await seedLink(auth);
    const response = await handleRequest(
      consume(
        "https://event-model.lonnylot.com/api/auth/consume?token=tok-1",
      ),
      env,
    );
    expect(response.headers.get("Set-Cookie")).toContain("Secure");
  });

  it("GET `/api/auth/consume` with a valid unused magic-link token sets a Session cookie that includes `SameSite=Lax`", async () => {
    const { env, auth } = authEnv();
    await seedLink(auth);
    const response = await handleRequest(
      consume(
        "https://event-model.lonnylot.com/api/auth/consume?token=tok-1",
      ),
      env,
    );
    expect(response.headers.get("Set-Cookie")).toContain("SameSite=Lax");
  });

  it("GET `/api/auth/consume` with a used magic-link token returns status 200", async () => {
    const { env, auth } = authEnv();
    await seedLink(auth, { usedAt: 1 });
    const response = await handleRequest(
      consume(
        "https://event-model.lonnylot.com/api/auth/consume?token=tok-1",
      ),
      env,
    );
    expect(response.status).toBe(200);
  });

  it("GET `/api/auth/consume` with a used magic-link token shows a heading whose accessible name is `This link is expired or already used.`", async () => {
    const { env, auth } = authEnv();
    await seedLink(auth, { usedAt: 1 });
    const response = await handleRequest(
      consume(
        "https://event-model.lonnylot.com/api/auth/consume?token=tok-1",
      ),
      env,
    );
    const html = await response.text();
    expect(html).toContain(
      "<h1>This link is expired or already used.</h1>",
    );
  });

  it("GET `/api/auth/consume` with an expired magic-link token returns status 200", async () => {
    const { env, auth } = authEnv();
    await seedLink(auth, { expiresAt: auth.now() - 1 });
    const response = await handleRequest(
      consume(
        "https://event-model.lonnylot.com/api/auth/consume?token=tok-1",
      ),
      env,
    );
    expect(response.status).toBe(200);
  });

  it("GET `/api/auth/consume` with an expired magic-link token shows a heading whose accessible name is `This link is expired or already used.`", async () => {
    const { env, auth } = authEnv();
    await seedLink(auth, { expiresAt: auth.now() - 1 });
    const response = await handleRequest(
      consume(
        "https://event-model.lonnylot.com/api/auth/consume?token=tok-1",
      ),
      env,
    );
    expect(await response.text()).toContain(
      "<h1>This link is expired or already used.</h1>",
    );
  });

  it("GET `/api/auth/consume` with a used magic-link token does not set a Session cookie", async () => {
    const { env, auth } = authEnv();
    await seedLink(auth, { usedAt: 1 });
    const response = await handleRequest(
      consume(
        "https://event-model.lonnylot.com/api/auth/consume?token=tok-1",
      ),
      env,
    );
    expect(response.headers.get("Set-Cookie")).toBeNull();
  });
});
