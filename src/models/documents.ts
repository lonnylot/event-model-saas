export type DocumentsPort = {
  put(key: string, body: string): Promise<void>;
  get(key: string): Promise<string | null>;
};

export function createMemoryDocuments(): DocumentsPort {
  const objects = new Map<string, string>();
  return {
    async put(key, body) {
      objects.set(key, body);
    },
    async get(key) {
      return objects.get(key) ?? null;
    },
  };
}
