import type { DocumentsPort } from "./documents";

export function createR2Documents(bucket: R2Bucket): DocumentsPort {
  return {
    async put(key, body) {
      await bucket.put(key, body);
    },
    async get(key) {
      const object = await bucket.get(key);
      if (!object) return null;
      return object.text();
    },
  };
}
