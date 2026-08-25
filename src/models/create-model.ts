import type { AuthRuntime } from "../auth/types";

export async function createModel(
  runtime: AuthRuntime,
  personId: string,
  teamId: string,
): Promise<{ status: number }> {
  if (!(await runtime.store.isMember(teamId, personId))) {
    return { status: 404 };
  }
  return { status: 201 };
}
