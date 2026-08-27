import { describe, expect, it, vi } from "vitest";
import { handleRequest } from "../../src/index.ts";

function envWithAssets(
  fetchImpl: (request: Request) => Promise<Response>,
): { ASSETS: { fetch: (request: Request) => Promise<Response> } } {
  return { ASSETS: { fetch: fetchImpl } };
}

describe("handleRequest", () => {
  it("GET `/api` returns status 404, content-type `application/json; charset=utf-8`, and body `{\"error\":\"not found\"}`", async () => {
    const assetsFetch = vi.fn();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/api"),
      envWithAssets(assetsFetch),
    );
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
    expect(await response.text()).toBe('{"error":"not found"}');
    expect(assetsFetch).not.toHaveBeenCalled();
  });

  it("GET `/api/anything` returns status 404, content-type `application/json; charset=utf-8`, and body `{\"error\":\"not found\"}`", async () => {
    const assetsFetch = vi.fn();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/api/anything"),
      envWithAssets(assetsFetch),
    );
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
    expect(await response.text()).toBe('{"error":"not found"}');
    expect(assetsFetch).not.toHaveBeenCalled();
  });

  it("GET `/favicon.png` returns status 200", async () => {
    const assetsFetch = vi.fn(async () => new Response("x", { status: 200 }));
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/favicon.png"),
      envWithAssets(assetsFetch),
    );
    expect(response.status).toBe(200);
  });

  it("GET `/favicon.png` returns content-type `image/png`", async () => {
    const assetsFetch = vi.fn(async () => new Response("x", { status: 200 }));
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/favicon.png"),
      envWithAssets(assetsFetch),
    );
    expect(response.headers.get("content-type")).toBe("image/png");
  });
});
