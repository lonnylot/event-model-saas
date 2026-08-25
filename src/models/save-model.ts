import type { AuthRuntime } from "../auth/types";
import { isValidEventModelDocument } from "../document/validate";
import type { DocumentsPort } from "./documents";

export async function saveModel(
  runtime: AuthRuntime,
  documents: DocumentsPort | undefined,
  personId: string,
  modelId: string,
  version: number,
  document: { format?: string } | undefined,
): Promise<{ status: number; version?: number }> {
  const model = await runtime.store.getEventModel(modelId);
  if (!model) return { status: 404 };
  if (!(await runtime.store.isMember(model.teamId, personId))) {
    return { status: 404 };
  }
  if (model.version !== version) return { status: 409 };
  if (!isValidEventModelDocument(document)) return { status: 400 };
  const next = model.version + 1;
  if (documents) {
    await documents.put(model.r2Key, JSON.stringify(document));
  }
  await runtime.store.setEventModelVersion(modelId, next);
  return { status: 200, version: next };
}
