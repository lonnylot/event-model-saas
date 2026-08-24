import { requestLink, REQUEST_LINK_OK_BODY } from "./auth/request-link";
import type { AuthRuntime } from "./auth/types";

export type AssetEnv = {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
};

export type AppEnv = AssetEnv & {
  auth?: AuthRuntime;
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
        origin: url.origin,
        clientIp: ip.split(",")[0].trim(),
      });
    }
    return jsonOk(REQUEST_LINK_OK_BODY);
  }
  if (path === "/api" || path.startsWith("/api/")) {
    return jsonNotFound();
  }
  return env.ASSETS.fetch(request);
}

export default {
  fetch(request: Request, env: AppEnv): Promise<Response> {
    return handleRequest(request, env);
  },
};
