import type { AuthRuntime } from "../auth/types";
import type { DocumentsPort } from "./documents";

export async function exportModel(
  runtime: AuthRuntime,
  documents: DocumentsPort | undefined,
  personId: string,
  modelId: string,
): Promise<{ status: number; body?: string }> {
  const model = await runtime.store.getEventModel(modelId);
  if (!model) return { status: 404 };
  const body = (await documents?.get(model.r2Key)) ?? "{}";
  return { status: 200, body };
}
