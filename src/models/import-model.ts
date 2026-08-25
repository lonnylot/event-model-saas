import type { AuthRuntime } from "../auth/types";
import { isValidEventModelDocument } from "../document/validate";
import type { DocumentsPort } from "./documents";

export async function importModel(
  runtime: AuthRuntime,
  documents: DocumentsPort | undefined,
  personId: string,
  teamId: string,
  document: { format?: string; title?: string } | undefined,
): Promise<{ status: number }> {
  if (!(await runtime.store.isMember(teamId, personId))) {
    return { status: 404 };
  }
  if (document?.format !== "eventmodel") return { status: 400 };
  if (!isValidEventModelDocument(document)) {
    const id = runtime.randomId();
    const r2Key = `models/${id}.eventmodel`;
    if (documents) {
      await documents.put(r2Key, JSON.stringify(document));
    }
    return { status: 400 };
  }
  const id = runtime.randomId();
  const r2Key = `models/${id}.eventmodel`;
  await runtime.store.insertEventModel({
    id,
    teamId,
    title: document.title ?? "Untitled",
    version: 1,
    r2Key,
  });
  if (documents) {
    await documents.put(r2Key, JSON.stringify(document));
  }
  return { status: 201 };
}
