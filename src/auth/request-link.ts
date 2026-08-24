import type { AuthRuntime, MailMessage } from "./types";

export const REQUEST_LINK_OK_BODY =
  '{"ok":true,"message":"If you have access, check your inbox."}';

const HOUR_MS = 60 * 60 * 1000;
const LINK_TTL_MS = 15 * 60 * 1000;
const EMAIL_LIMIT = 5;
const IP_LIMIT = 20;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function requestLink(
  runtime: AuthRuntime,
  input: { email: string; origin: string; clientIp: string },
): Promise<MailMessage[]> {
  const email = normalizeEmail(input.email);
  const now = runtime.now();
  const sent: MailMessage[] = [];

  await runtime.store.insertAttempt(`email:${email}`, now);
  await runtime.store.insertAttempt(`ip:${input.clientIp}`, now);

  const emailCount = await runtime.store.countAttempts(
    `email:${email}`,
    now - HOUR_MS,
  );
  const ipCount = await runtime.store.countAttempts(
    `ip:${input.clientIp}`,
    now - HOUR_MS,
  );
  if (emailCount > EMAIL_LIMIT || ipCount > IP_LIMIT) {
    return sent;
  }

  const siteAdmin = normalizeEmail(runtime.siteAdminEmail);
  let person = await runtime.store.getPersonByEmail(email);

  if (!person && email === siteAdmin) {
    person = {
      id: runtime.randomId(),
      email,
      isSiteAdmin: true,
    };
    await runtime.store.insertPerson(person);
  }

  if (!person) {
    const notify: MailMessage = {
      to: runtime.siteAdminEmail,
      from: runtime.authFrom,
      subject: "Sign-in attempt without an account",
      text: `${email} tried to sign in and has no account.`,
    };
    await runtime.mail.send(notify);
    sent.push(notify);
    return sent;
  }

  const token = runtime.randomId();
  await runtime.store.insertMagicLink({
    token,
    personId: person.id,
    expiresAt: now + LINK_TTL_MS,
    usedAt: null,
  });
  const consumeUrl = `${input.origin}/api/auth/consume?token=${token}`;
  const magic: MailMessage = {
    to: email,
    from: runtime.authFrom,
    subject: "Sign in to Event Model",
    text: `Sign in: ${consumeUrl}`,
  };
  await runtime.mail.send(magic);
  sent.push(magic);
  return sent;
}
