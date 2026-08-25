import type { AuthRuntime } from "../auth/types";

export async function saveModel(
  runtime: AuthRuntime,
  personId: string,
  modelId: string,
  version: number,
): Promise<{ status: number; version?: number }> {
  const model = await runtime.store.getEventModel(modelId);
  if (!model) return { status: 404 };
  if (!(await runtime.store.isMember(model.teamId, personId))) {
    return { status: 404 };
  }
  if (model.version !== version) return { status: 409 };
  const next = model.version + 1;
  await runtime.store.setEventModelVersion(modelId, next);
  return { status: 200, version: next };
}
