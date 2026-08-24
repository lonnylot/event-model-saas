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
import { createTeam } from "./teams/create-team";

export type AssetEnv = {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
};

export type AppEnv = AssetEnv & {
  auth?: AuthRuntime;
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
  if (path === "/app") {
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
    return new Response(appPageHtml(person.email), {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
  return env.ASSETS.fetch(request);
}

type WorkerEnv = AppEnv & {
  SITE_ADMIN_EMAIL?: string;
  AUTH_FROM?: string;
  DB?: D1Database;
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
  };
  if (!g.__emAuth) {
    const sent: MailMessage[] = [];
    g.__emSent = sent;
    g.__emAuth = {
      store: createMemoryStore(),
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
    return handleRequest(request, { ...env, auth });
  },
};
