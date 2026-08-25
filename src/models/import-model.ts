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
  if (document?.format !== "eventmodel") {
    const id = runtime.randomId();
    await runtime.store.insertEventModel({
      id,
      teamId,
      title: "Untitled",
      version: 1,
      r2Key: `models/${id}.eventmodel`,
    });
    return { status: 400 };
  }
  return { status: 201 };
}
