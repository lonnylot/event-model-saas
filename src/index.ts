export type AssetEnv = {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
};

const JSON_NOT_FOUND_BODY = '{"error":"not found"}';
const REQUEST_LINK_OK_BODY =
  '{"ok":true,"message":"If you have access, check your inbox."}';

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
  env: AssetEnv,
): Promise<Response> {
  const path = new URL(request.url).pathname;
  if (path === "/api/auth/request-link" && request.method === "POST") {
    return jsonOk(REQUEST_LINK_OK_BODY);
  }
  if (path === "/api" || path.startsWith("/api/")) {
    return jsonNotFound();
  }
  return env.ASSETS.fetch(request);
}

export default {
  fetch(request: Request, env: AssetEnv): Promise<Response> {
    return handleRequest(request, env);
  },
};
