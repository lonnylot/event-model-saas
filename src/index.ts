import { consumeLink } from "./auth/consume-link";
import { createD1Store } from "./auth/d1-store";
import { createMemoryStore } from "./auth/memory-store";
import { requestLink, REQUEST_LINK_OK_BODY } from "./auth/request-link";
import type { MailMessage } from "./auth/types";
import {
  appPageHtml,
  clearSessionCookie,
  personFromRequest,
  readSessionId,
} from "./auth/session";
import type { AuthRuntime } from "./auth/types";
import { createModel } from "./models/create-model";
import { importModel } from "./models/import-model";
import { exportModel } from "./models/export-model";
import { saveModel } from "./models/save-model";
import {
  createMemoryDocuments,
  type DocumentsPort,
} from "./models/documents";
import { createR2Documents } from "./models/r2-documents";
import { createTeam } from "./teams/create-team";
import { inviteToTeam } from "./teams/invite";
import {
  adminTeamsHtml,
  noTeamsAdminHtml,
  modelPageHtml,
  pickerHtml,
  teamPageHtml,
} from "./teams/pages";

export type AssetEnv = {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
};

export type AppEnv = AssetEnv & {
  auth?: AuthRuntime;
  documents?: DocumentsPort;
  TEST_MAIL?: string;
};

const JSON_NOT_FOUND_BODY = '{"error":"not found"}';

export function jsonNotFound(): Response {
  return new Response(JSON_NOT_FOUND_BODY, {
    status: 404,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export function jsonOk(body: string): Response {
  return new Response(body, {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function handleRequest(
  request: Request,
  env: AppEnv,
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  if (path === "/api/auth/request-link" && request.method === "POST") {
    if (env.auth) {
      let email = "";
      try {
        const body = (await request.json()) as { email?: string };
        email = typeof body.email === "string" ? body.email : "";
      } catch {
        email = "";
      }
      const ip =
        request.headers.get("cf-connecting-ip") ??
        request.headers.get("x-forwarded-for") ??
        "0.0.0.0";
      await requestLink(env.auth, {
        email,
        origin: request.headers.get("Origin") ?? url.origin,
        clientIp: ip.split(",")[0].trim(),
      });
    }
    return jsonOk(REQUEST_LINK_OK_BODY);
  }
  if (path === "/api/auth/consume" && request.method === "GET") {
    if (env.auth) {
      return consumeLink(env.auth, url.searchParams.get("token") ?? "", url);
    }
  }
  if (path === "/api/test/last-mail" && request.method === "GET") {
    if (env.TEST_MAIL !== "1") return jsonNotFound();
    const g = globalThis as unknown as { __emSent?: MailMessage[] };
    const last = g.__emSent?.at(-1) ?? null;
    return jsonOk(JSON.stringify({ text: last?.text ?? "" }));
  }

  if (request.method === "GET" && (path === "/favicon.png" || path === "/og.png")) {
    const asset = await env.ASSETS.fetch(request);
    const headers = new Headers();
    if (path === "/favicon.png") headers.set("content-type", "image/png");
    return new Response(asset.body, { status: asset.status, headers });
  }
  if (path === "/api/teams" && request.method === "POST") {
    if (!env.auth) return jsonNotFound();
    const person = await personFromRequest(env.auth, request);
    if (!person) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/" },
      });
    }
    let name = "";
    try {
      const body = (await request.json()) as { name?: string };
      name = typeof body.name === "string" ? body.name : "";
    } catch {
      name = "";
    }
    const result = await createTeam(
      env.auth,
      person.id,
      person.isSiteAdmin,
      name,
    );
    if (result.status === 201 && result.team) {
      return new Response(JSON.stringify({ ok: true, id: result.team.id }), {
        status: 201,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }
    return new Response(JSON.stringify({ error: "forbidden" }), {
      status: result.status,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
  const importMatch = path.match(/^\/api\/teams\/([^/]+)\/imports$/);
  if (importMatch && request.method === "POST") {
    if (!env.auth) return jsonNotFound();
    const person = await personFromRequest(env.auth, request);
    if (!person) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/" },
      });
    }
    let document: { format?: string; title?: string } | undefined;
    try {
      const body = (await request.json()) as {
        document?: { format?: string; title?: string };
      };
      document = body.document;
    } catch {
      document = undefined;
    }
    const result = await importModel(
      env.auth,
      env.documents,
      person.id,
      importMatch[1],
      document,
    );
    return new Response(null, { status: result.status });
  }
  const modelsMatch = path.match(/^\/api\/teams\/([^/]+)\/models$/);
  if (modelsMatch && request.method === "POST") {
    if (!env.auth) return jsonNotFound();
    const person = await personFromRequest(env.auth, request);
    if (!person) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/" },
      });
    }
    const result = await createModel(
      env.auth,
      env.documents,
      person.id,
      modelsMatch[1],
    );
    if (result.status === 201) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }
    return jsonNotFound();
  }
  const exportMatch = path.match(/^\/api\/models\/([^/]+)\/export$/);
  if (exportMatch && request.method === "GET") {
    if (!env.auth) return jsonNotFound();
    const person = await personFromRequest(env.auth, request);
    if (!person) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/" },
      });
    }
    const result = await exportModel(
      env.auth,
      env.documents,
      person.id,
      exportMatch[1],
    );
    if (result.status === 200) {
      return new Response(result.body ?? "{}", {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Content-Disposition": `attachment; filename="${result.title}.eventmodel"`,
        },
      });
    }
    return jsonNotFound();
  }
  const saveMatch = path.match(/^\/api\/models\/([^/]+)$/);
  if (saveMatch && request.method === "PUT") {
    if (!env.auth) return jsonNotFound();
    const person = await personFromRequest(env.auth, request);
    if (!person) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/" },
      });
    }
    let version = -1;
    let document: { format?: string } | undefined;
    try {
      const body = (await request.json()) as {
        version?: number;
        document?: { format?: string };
      };
      version = typeof body.version === "number" ? body.version : -1;
      document = body.document;
    } catch {
      version = -1;
    }
    const result = await saveModel(
      env.auth,
      env.documents,
      person.id,
      saveMatch[1],
      version,
      document,
    );
    if (result.status === 200 && result.version != null) {
      return new Response(JSON.stringify({ version: result.version }), {
        status: 200,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }
    return new Response(null, { status: result.status });
  }
  const inviteMatch = path.match(/^\/api\/teams\/([^/]+)\/invites$/);
  if (inviteMatch && request.method === "POST") {
    if (!env.auth) return jsonNotFound();
    const person = await personFromRequest(env.auth, request);
    if (!person) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/" },
      });
    }
    let email = "";
    try {
      const body = (await request.json()) as { email?: string };
      email = typeof body.email === "string" ? body.email : "";
    } catch {
      email = "";
    }
    const result = await inviteToTeam(
      env.auth,
      person.isSiteAdmin,
      inviteMatch[1],
      email,
      request.headers.get("Origin") ?? url.origin,
    );
    return new Response(
      JSON.stringify(
        result.status === 201 ? { ok: true } : { error: "forbidden" },
      ),
      {
        status: result.status,
        headers: { "content-type": "application/json; charset=utf-8" },
      },
    );
  }
  if (path === "/api/auth/sign-out" && request.method === "POST") {
    if (env.auth) {
      const sid = readSessionId(request.headers.get("Cookie"));
      if (sid) await env.auth.store.deleteSession(sid);
    }
    return new Response(null, {
      status: 303,
      headers: {
        Location: "/",
        "Set-Cookie": clearSessionCookie(),
      },
    });
  }
  if (path === "/api" || path.startsWith("/api/")) {
    return jsonNotFound();
  }
  if (path === "/app" || path.startsWith("/app/")) {
    if (!env.auth) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/" },
      });
    }
    const person = await personFromRequest(env.auth, request);
    if (!person) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/" },
      });
    }
    const teams = await env.auth.store.listTeamsForPerson(person.id);
    if (path === "/app/admin/teams") {
      if (!person.isSiteAdmin) {
        return new Response(null, {
          status: 303,
          headers: { Location: "/app" },
        });
      }
      return new Response(adminTeamsHtml(person.email, teams), {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    const modelPage = path.match(
      /^\/app\/teams\/([^/]+)\/models\/([^/]+)$/,
    );
    if (modelPage) {
      const member = await env.auth.store.isMember(modelPage[1], person.id);
      if (!member) {
        return jsonNotFound();
      }
      const model = await env.auth.store.getEventModel(modelPage[2]);
      if (!model || model.teamId !== modelPage[1]) {
        return jsonNotFound();
      }
      const team = await env.auth.store.getTeam(modelPage[1]);
      if (!team) return jsonNotFound();
      const stored = await env.documents?.get(model.r2Key);
      const parsed = stored ? JSON.parse(stored) : { slices: [] };
      const documentJson = JSON.stringify(parsed).replaceAll("<", "\\u003c");
      return new Response(
        modelPageHtml(
          person.email,
          parsed.title ?? model.title,
          model.id,
          model.version,
          team.name,
          parsed.slices ?? [],
          documentJson,
          parsed.connections ?? [],
        ),
        {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    const teamPage = path.match(/^\/app\/teams\/([^/]+)$/);
    if (teamPage) {
      const member = await env.auth.store.isMember(teamPage[1], person.id);
      if (!member) {
        return jsonNotFound();
      }
      const team = await env.auth.store.getTeam(teamPage[1]);
      if (!team) return jsonNotFound();
      const models = await env.auth.store.listEventModelsForTeam(team.id);
      return new Response(
        teamPageHtml(person.email, person.isSiteAdmin, team, models),
        {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" },
        },
      );
    }
    if (path === "/app") {
      if (teams.length === 1) {
        return new Response(null, {
          status: 303,
          headers: { Location: `/app/teams/${teams[0].id}` },
        });
      }
      if (teams.length > 1) {
        return new Response(
          pickerHtml(person.email, person.isSiteAdmin, teams),
          {
            status: 200,
            headers: { "content-type": "text/html; charset=utf-8" },
          },
        );
      }
      if (person.isSiteAdmin) {
        return new Response(noTeamsAdminHtml(person.email), {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }
      return new Response(appPageHtml(person.email), {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  }
  return env.ASSETS.fetch(request);
}

type WorkerEnv = AppEnv & {
  SITE_ADMIN_EMAIL?: string;
  AUTH_FROM?: string;
  DB?: D1Database;
  MODELS?: R2Bucket;
  EMAIL?: {
    send: (message: {
      to: string;
      from: { email: string; name?: string };
      subject: string;
      text: string;
    }) => Promise<unknown>;
  };
};

function testAuthRuntime(env: WorkerEnv): AuthRuntime {
  const g = globalThis as unknown as {
    __emAuth?: AuthRuntime;
    __emSent?: MailMessage[];
    __emDocuments?: DocumentsPort;
  };
  if (!g.__emAuth) {
    const sent: MailMessage[] = [];
    g.__emSent = sent;
    g.__emDocuments = createMemoryDocuments();
    const store = createMemoryStore();
    g.__emAuth = {
      store: {
        ...store,
        insertAttempt: async () => {},
        countAttempts: async () => 0,
      },
      mail: {
        async send(message) {
          sent.push(message);
        },
      },
      now: () => Date.now(),
      randomId: () => crypto.randomUUID(),
      siteAdminEmail: env.SITE_ADMIN_EMAIL ?? "lonny@lonnylot.com",
      authFrom: env.AUTH_FROM ?? "auth@event-model.lonnylot.com",
    };
  }
  return g.__emAuth;
}

function testDocuments(): DocumentsPort {
  const g = globalThis as unknown as { __emDocuments?: DocumentsPort };
  if (!g.__emDocuments) g.__emDocuments = createMemoryDocuments();
  return g.__emDocuments;
}

function productionAuthRuntime(env: WorkerEnv): AuthRuntime | undefined {
  if (!env.DB) return undefined;
  return {
    store: createD1Store(env.DB),
    mail: {
      async send(message) {
        if (!env.EMAIL) return;
        await env.EMAIL.send({
          to: message.to,
          from: { email: message.from, name: "Event Model" },
          subject: message.subject,
          text: message.text,
        });
      },
    },
    now: () => Date.now(),
    randomId: () => crypto.randomUUID(),
    siteAdminEmail: env.SITE_ADMIN_EMAIL ?? "lonny@lonnylot.com",
    authFrom: env.AUTH_FROM ?? "auth@event-model.lonnylot.com",
  };
}

export default {
  fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const auth =
      env.TEST_MAIL === "1"
        ? testAuthRuntime(env)
        : (env.auth ?? productionAuthRuntime(env));
    const documents =
      env.TEST_MAIL === "1"
        ? testDocuments()
        : (env.documents ??
          (env.MODELS ? createR2Documents(env.MODELS) : undefined));
    return handleRequest(request, { ...env, auth, documents });
  },
};
