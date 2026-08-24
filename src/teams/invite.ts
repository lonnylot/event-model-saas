import { normalizeEmail } from "../auth/request-link";
import type { AuthRuntime, MailMessage } from "../auth/types";

const LINK_TTL_MS = 15 * 60 * 1000;
export const INVITE_SUBJECT = "Magic link";

export async function inviteToTeam(
  runtime: AuthRuntime,
  isSiteAdmin: boolean,
  teamId: string,
  emailRaw: string,
  origin: string,
): Promise<{ status: number; sent: MailMessage[] }> {
  if (!isSiteAdmin) return { status: 403, sent: [] };
  const team = await runtime.store.getTeam(teamId);
  if (!team) return { status: 404, sent: [] };
  const email = normalizeEmail(emailRaw);
  if (!email) return { status: 400, sent: [] };

  let person = await runtime.store.getPersonByEmail(email);
  if (!person) return { status: 201, sent: [] };
  return { status: 201, sent: [] };
}
