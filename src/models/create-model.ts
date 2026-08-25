import type { AuthRuntime } from "../auth/types";

export async function createModel(
  runtime: AuthRuntime,
  personId: string,
  teamId: string,
): Promise<{ status: number }> {
  if (!(await runtime.store.isMember(teamId, personId))) {
    return { status: 404 };
  }
  const id = runtime.randomId();
  await runtime.store.insertEventModel({
    id,
    teamId,
    title: "Untitled",
    version: 0,
    r2Key: `models/${id}.eventmodel`,
  });
  return { status: 201 };
}
