import schema from "../../schemas/eventmodel.schema.json";

export function isValidEventModelDocument(document: unknown): boolean {
  if (document === null || typeof document !== "object" || Array.isArray(document)) {
    return false;
  }
  const obj = document as Record<string, unknown>;
  for (const key of schema.required) {
    if (!Object.hasOwn(obj, key)) return false;
  }
  if (schema.additionalProperties === false) {
    const allowed = new Set(Object.keys(schema.properties));
    for (const key of Object.keys(obj)) {
      if (!allowed.has(key)) return false;
    }
  }
  if (obj.format !== schema.properties.format.const) return false;
  if (
    typeof obj.schemaVersion !== "number" ||
    !Number.isInteger(obj.schemaVersion) ||
    obj.schemaVersion < schema.properties.schemaVersion.minimum
  ) {
    return false;
  }
  if (typeof obj.id !== "string") return false;
  if (typeof obj.title !== "string") return false;
  if (!Array.isArray(obj.slices)) return false;
  return true;
}
