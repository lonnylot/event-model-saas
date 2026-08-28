import { normalizeEmail } from "./request-link";
import type { AuthRuntime } from "./types";

export const WAITLIST_OK_BODY =
  '{"ok":true,"message":"If you\'re on the list, we\'ll be in touch."}';

const HOUR_MS = 60 * 60 * 1000;
const EMAIL_LIMIT = 5;

export async function joinWaitlist(
  runtime: AuthRuntime,
  input: { email: string; clientIp: string },
): Promise<void> {
  const email = normalizeEmail(input.email);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
  const now = runtime.now();
  await runtime.store.insertAttempt(`waitlist-email:${email}`, now);
  const emailCount = await runtime.store.countAttempts(
    `waitlist-email:${email}`,
    now - HOUR_MS,
  );
  if (emailCount > EMAIL_LIMIT) return;
  if (await runtime.store.getPersonByEmail(email)) return;
  if (await runtime.store.isWaitlisted(email)) return;
  await runtime.store.insertWaitlist(email);
  await runtime.mail.send({
    to: runtime.siteAdminEmail,
    from: runtime.authFrom,
    subject: "Waitlist request",
    text: email,
  });
}
