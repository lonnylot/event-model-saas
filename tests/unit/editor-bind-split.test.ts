import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { createMemoryStore } from "../../src/auth/memory-store.ts";
import type { AuthRuntime } from "../../src/auth/types.ts";
import { handleRequest } from "../../src/index.ts";
import { createMemoryDocuments } from "../../src/models/documents.ts";

const ROOT = resolve(".");
const SKIP_DIRS = new Set(["node_modules", ".git"]);

function walkSourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      out.push(...walkSourceFiles(path));
      continue;
    }
    if (/\.(js|ts|mjs|cjs)$/.test(name)) out.push(path);
  }
  return out;
}

function importSourcesOf(name: string): string[] {
  const namedImport = new RegExp(
    String.raw`(?:import|export)\s+\{[^}]*\b${name}\b[^}]*\}\s+from\s+["']([^"']+)["']`,
    "g",
  );
  const sources: string[] = [];
  for (const file of walkSourceFiles(ROOT)) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(namedImport)) {
      const specifier = match[1];
      if (!specifier.startsWith(".")) continue;
      sources.push(resolve(dirname(file), specifier));
    }
  }
  return sources;
}

function declarationFilesOf(name: string): string[] {
  const declaration = new RegExp(
    String.raw`(?:export\s+)?(?:async\s+)?function\s+${name}\b|(?:export\s+)?(?:const|let|var)\s+${name}\s*=`,
  );
  const files: string[] = [];
  for (const file of walkSourceFiles(ROOT)) {
    const text = readFileSync(file, "utf8");
    if (declaration.test(text)) files.push(resolve(file));
  }
  return files;
}

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

  it("`bindInspect` is imported only from `public/editor-inspect.js`", () => {
    const expected = resolve("public/editor-inspect.js");
    const sources = importSourcesOf("bindInspect");
    expect(sources.length).toBeGreaterThan(0);
    expect(sources.every((source) => source === expected)).toBe(true);
    expect(declarationFilesOf("bindInspect")).toEqual([expected]);
  });
});
