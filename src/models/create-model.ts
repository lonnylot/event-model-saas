import type { AuthRuntime } from "../auth/types";

export async function createModel(
  runtime: AuthRuntime,
  personId: string,
  teamId: string,
): Promise<{ status: number }> {
  return { status: 201 };
}
