import type { AuthRuntime } from "../auth/types";

type Team = { id: string; name: string };

export async function createTeam(
  runtime: AuthRuntime,
  personId: string,
  isSiteAdmin: boolean,
  name: string,
): Promise<{ status: number; team?: Team }> {
  const trimmed = name.trim();
  if (!trimmed) return { status: 400 };
  const team: Team = { id: runtime.randomId(), name: trimmed };
  return { status: 201, team };
}
