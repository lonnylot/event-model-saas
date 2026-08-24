import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
  scripts: Record<string, string>;
};

describe("package.json scripts", () => {
  it("`package.json` script `test:e2e` includes the tokens `playwright` and `test`", () => {
    const script = pkg.scripts["test:e2e"];
    expect(script).toBeDefined();
    const tokens = script.split(/\s+/);
    expect(tokens).toContain("playwright");
    expect(tokens).toContain("test");
  });

  it("`package.json` script `deploy` is `wrangler deploy`", () => {
    expect(pkg.scripts.deploy).toBe("wrangler deploy");
  });
});
