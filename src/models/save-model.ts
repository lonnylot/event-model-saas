import type { AuthRuntime } from "../auth/types";

export async function saveModel(
  runtime: AuthRuntime,
  personId: string,
  modelId: string,
  version: number,
): Promise<{ status: number }> {
  const model = await runtime.store.getEventModel(modelId);
  if (!model) return { status: 404 };
  if (model.version !== version) return { status: 409 };
  return { status: 200 };
}
