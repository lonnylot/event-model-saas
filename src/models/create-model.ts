import type { AuthRuntime } from "../auth/types";
import type { DocumentsPort } from "./documents";

export async function createModel(
  runtime: AuthRuntime,
  documents: DocumentsPort | undefined,
  personId: string,
  teamId: string,
): Promise<{ status: number }> {
  if (!(await runtime.store.isMember(teamId, personId))) {
    return { status: 404 };
  }
  const id = runtime.randomId();
  const r2Key = `models/${id}.eventmodel`;
  await runtime.store.insertEventModel({
    id,
    teamId,
    title: "Untitled",
    version: 1,
    r2Key,
  });
  if (documents) {
    await documents.put(
      r2Key,
      JSON.stringify({
        format: "eventmodel",
        schemaVersion: 1,
        id,
        title: "Untitled",
        description: "",
        slices: [
          {
            id: runtime.randomId(),
            title: "New Slice",
            sliceType: "STATE_CHANGE",
            actors: [{ id: runtime.randomId(), name: "Actor" }],
            commands: [],
            events: [],
          },
        ],
        connections: [],
      }),
    );
  }
  return { status: 201 };
}
