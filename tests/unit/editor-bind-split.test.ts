import { describe, expect, it, vi } from "vitest";
import { createMemoryStore } from "../../src/auth/memory-store.ts";
import type { AuthRuntime } from "../../src/auth/types.ts";
import { handleRequest } from "../../src/index.ts";
import { createMemoryDocuments } from "../../src/models/documents.ts";

async function createdUntitled() {
  const store = createMemoryStore();
  let n = 0;
  const auth: AuthRuntime = {
    store,
    mail: { async send() {} },
    now: () => 1_700_000_000_000,
    randomId: () => {
      n += 1;
      return n === 1 ? "team-1" : "model-1";
    },
    siteAdminEmail: "lonny@lonnylot.com",
    authFrom: "auth@event-model.lonnylot.com",
  };
  await store.insertPerson({
    id: "p-admin",
    email: "lonny@lonnylot.com",
    isSiteAdmin: true,
  });
  await store.insertSession({
    id: "sess-admin",
    personId: "p-admin",
    expiresAt: auth.now() + 60_000,
  });
  const env = {
    ASSETS: { fetch: vi.fn() },
    auth,
    documents: createMemoryDocuments(),
  };
  await handleRequest(
    new Request("https://event-model.lonnylot.com/api/teams", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Cookie: "session=sess-admin",
      },
      body: JSON.stringify({ name: "Library" }),
    }),
    env,
  );
  await handleRequest(
    new Request("https://event-model.lonnylot.com/api/teams/team-1/models", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Cookie: "session=sess-admin",
      },
      body: JSON.stringify({}),
    }),
    env,
  );
  return env;
}

describe("editor bind split", () => {
  it("GET `/app/teams/{id}/models/{mid}` as a member includes a script whose `src` is `/editor.js`", async () => {
    const env = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    const html = await response.text();
    const srcs = [...html.matchAll(/<script\b([^>]*)>/gi)].map((match) => {
      const src = match[1].match(/\bsrc\s*=\s*["']([^"']*)["']/i);
      return src?.[1];
    });
    expect(srcs).toContain("/editor.js");
  });
});
