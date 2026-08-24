import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const wrangler = JSON.parse(readFileSync("wrangler.jsonc", "utf8")) as {
  name: string;
  routes?: { pattern: string; custom_domain: boolean }[];
};

describe("wrangler.jsonc", () => {
  it("`wrangler.jsonc` `name` is `event-model-saas`", () => {
    expect(wrangler.name).toBe("event-model-saas");
  });
});
