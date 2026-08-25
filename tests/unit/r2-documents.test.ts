import { describe, expect, it } from "vitest";
import { createR2Documents } from "../../src/models/r2-documents.ts";

function fakeR2() {
  const objects = new Map<string, string>();
  return {
    async put(key: string, value: string) {
      objects.set(key, value);
      return {};
    },
    async get(key: string) {
      const body = objects.get(key);
      if (body == null) return null;
      return { text: async () => body };
    },
  } as unknown as R2Bucket;
}

describe("createR2Documents", () => {
  it("`createR2Documents` `put` of `models/{id}.eventmodel` returns that body from `get`", async () => {
    const docs = createR2Documents(fakeR2());
    await docs.put("models/model-1.eventmodel", '{"format":"eventmodel"}');
    expect(await docs.get("models/model-1.eventmodel")).toBe(
      '{"format":"eventmodel"}',
    );
  });
});
