import { describe, expect, it, vi } from "vitest";
import { handleRequest } from "../../src/index.ts";

function envWithAssets() {
  return { ASSETS: { fetch: vi.fn() } };
}

describe("request-link", () => {
  it("POST `/api/auth/request-link` returns status 200, content-type `application/json; charset=utf-8`, and body `{\"ok\":true,\"message\":\"If you have access, check your inbox.\"}`", async () => {
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/api/auth/request-link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "lonny@lonnylot.com" }),
      }),
      envWithAssets(),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
    expect(await response.text()).toBe(
      '{"ok":true,"message":"If you have access, check your inbox."}',
    );
  });
});
