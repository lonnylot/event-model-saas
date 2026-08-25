import type { AuthRuntime } from "../auth/types";

export async function importModel(
  runtime: AuthRuntime,
  personId: string,
  teamId: string,
  document: { format?: string; title?: string } | undefined,
): Promise<{ status: number }> {
  if (!(await runtime.store.isMember(teamId, personId))) {
    return { status: 404 };
  }
  if (document?.format !== "eventmodel") return { status: 400 };
  return { status: 201 };
}
