import { normalizeEmail } from "../auth/request-link";
import type { AuthRuntime, MailMessage } from "../auth/types";

const LINK_TTL_MS = 15 * 60 * 1000;
export const INVITE_SUBJECT = "You are invited to Event Model";

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
  if (!person) {
    person = {
      id: runtime.randomId(),
      email,
      isSiteAdmin: false,
    };
    await runtime.store.insertPerson(person);
  }
  await runtime.store.addMembership(teamId, person.id);
  const token = runtime.randomId();
  await runtime.store.insertMagicLink({
    token,
    personId: person.id,
    expiresAt: runtime.now() + LINK_TTL_MS,
    usedAt: null,
  });
  const mail: MailMessage = {
    to: email,
    from: runtime.authFrom,
    subject: INVITE_SUBJECT,
    text: `Sign in: ${origin}/api/auth/consume?token=${token}`,
  };
  await runtime.mail.send(mail);
  return { status: 201, sent: [mail] };
}
