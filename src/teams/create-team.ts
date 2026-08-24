import type { AuthRuntime, Team } from "../auth/types";

export async function createTeam(
  runtime: AuthRuntime,
  personId: string,
  isSiteAdmin: boolean,
  name: string,
): Promise<{ status: number; team?: Team }> {
  if (!isSiteAdmin) return { status: 403 };
  const trimmed = name.trim();
  if (!trimmed) return { status: 400 };
  const team: Team = { id: runtime.randomId(), name: trimmed };
  await runtime.store.insertTeam(team);
  await runtime.store.addMembership(team.id, personId);
  return { status: 201, team };
}
