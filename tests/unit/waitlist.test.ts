import { describe, expect, it, vi } from "vitest";
import { handleRequest } from "../../src/index.ts";

function envWithAssets() {
  return { ASSETS: { fetch: vi.fn() } };
}

function waitlistPost(email: string, ip = "203.0.113.1") {
  return new Request("https://event-model.lonnylot.com/api/waitlist", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cf-connecting-ip": ip,
    },
    body: JSON.stringify({ email }),
  });
}

describe("waitlist", () => {
  it("POST `/api/waitlist` returns status 200", async () => {
    const response = await handleRequest(
      waitlistPost("wait@example.com"),
      envWithAssets(),
    );
    expect(response.status).toBe(200);
  });

  it("POST `/api/waitlist` returns content-type `application/json; charset=utf-8`", async () => {
    const response = await handleRequest(
      waitlistPost("wait@example.com"),
      envWithAssets(),
    );
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
  });

  it('POST `/api/waitlist` returns body `{"ok":true,"message":"If you\'re on the list, we\'ll be in touch."}`', async () => {
    const response = await handleRequest(
      waitlistPost("wait@example.com"),
      envWithAssets(),
    );
    expect(await response.text()).toBe(
      '{"ok":true,"message":"If you\'re on the list, we\'ll be in touch."}',
    );
  });
});


