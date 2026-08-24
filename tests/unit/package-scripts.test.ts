import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
  scripts: Record<string, string>;
};

describe("package.json scripts", () => {
  it("`package.json` script `test:e2e` is `playwright test`", () => {
    expect(pkg.scripts["test:e2e"]).toBe("playwright test");
  });

  it("`package.json` script `deploy` is `wrangler deploy`", () => {
    expect(pkg.scripts.deploy).toBe("wrangler deploy");
  });
});
