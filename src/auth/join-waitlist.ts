import { normalizeEmail } from "./request-link";
import type { AuthRuntime } from "./types";

export const WAITLIST_OK_BODY =
  '{"ok":true,"message":"If you\'re on the list, we\'ll be in touch."}';

export async function joinWaitlist(
  runtime: AuthRuntime,
  input: { email: string; clientIp: string },
): Promise<void> {
  const email = normalizeEmail(input.email);
  await runtime.store.insertWaitlist(email);
}
