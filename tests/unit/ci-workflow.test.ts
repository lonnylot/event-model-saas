import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type WorkflowJob = {
  needs: string[];
  if: string | undefined;
  runs: string[];
};

function unquote(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseNeeds(value: string): string[] {
  const trimmed = value.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => unquote(item))
      .filter((item) => item.length > 0);
  }
  if (trimmed.length === 0) {
    return [];
  }
  return [unquote(trimmed)];
}

function jobsFromWorkflow(text: string): Record<string, WorkflowJob> {
  const jobs: Record<string, WorkflowJob> = {};
  let inJobs = false;
  let current: string | undefined;
  let inNeedsList = false;
  for (const line of text.split("\n")) {
    if (line === "jobs:") {
      inJobs = true;
      current = undefined;
      inNeedsList = false;
      continue;
    }
    if (!inJobs) {
      continue;
    }
    if (line !== "" && !line.startsWith(" ") && !line.startsWith("#")) {
      break;
    }
    const jobMatch = /^  ([A-Za-z0-9_-]+):\s*$/.exec(line);
    if (jobMatch) {
      current = jobMatch[1];
      jobs[current] = { needs: [], if: undefined, runs: [] };
      inNeedsList = false;
      continue;
    }
    if (!current) {
      continue;
    }
    const ifMatch = /^    if:\s*(.*)$/.exec(line);
    if (ifMatch) {
      jobs[current].if = unquote(ifMatch[1]);
      inNeedsList = false;
      continue;
    }
    const needsMatch = /^    needs:\s*(.*)$/.exec(line);
    if (needsMatch) {
      const rest = needsMatch[1].trim();
      if (rest.length === 0) {
        inNeedsList = true;
        continue;
      }
      jobs[current].needs = parseNeeds(rest);
      inNeedsList = false;
      continue;
    }
    if (inNeedsList) {
      const itemMatch = /^      - (.+)$/.exec(line);
      if (itemMatch) {
        jobs[current].needs.push(unquote(itemMatch[1]));
        continue;
      }
      inNeedsList = false;
    }
    const runMatch =
      /^      - run:\s*(.*)$/.exec(line) ?? /^        run:\s*(.*)$/.exec(line);
    if (runMatch) {
      jobs[current].runs.push(unquote(runMatch[1]));
    }
  }
  return jobs;
}

describe("GitHub Actions CI", () => {
  const text = readFileSync(".github/workflows/ci.yml", "utf8");
  const lines = text.split("\n");
  const jobs = jobsFromWorkflow(text);

  it("GitHub Actions workflow `.github/workflows/ci.yml` runs on `pull_request`", () => {
    expect(lines).toContain("  pull_request:");
    expect(lines.some((line) => line.includes("pull_request_target"))).toBe(
      false,
    );
  });

  it("GitHub Actions workflow `.github/workflows/ci.yml` runs on `push` to `main`", () => {
    expect(text).toMatch(/push:\n\s+branches:\s*\[main\]/);
  });

  it("GitHub Actions workflow `.github/workflows/ci.yml` has a step whose `run` is `npm test`", () => {
    expect(lines).toContain("      - run: npm test");
  });

  it("GitHub Actions workflow `.github/workflows/ci.yml` has a job named `deploy` whose `needs` includes `test`", () => {
    expect(jobs.deploy).toBeDefined();
    expect(jobs.deploy.needs).toContain("test");
  });
});
