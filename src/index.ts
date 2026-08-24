export type AssetEnv = {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
};

const JSON_NOT_FOUND_BODY = '{"error":"not found"}';

export function jsonNotFound(): Response {
  return new Response(JSON_NOT_FOUND_BODY, {
    status: 404,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function handleRequest(
  request: Request,
  env: AssetEnv,
): Promise<Response> {
  const path = new URL(request.url).pathname;
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
