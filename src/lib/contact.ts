export const TOPICS = [
  "Need a doctor’s advice",
  "Join as a doctor",
  "Contribute or donate",
  "Something else",
  "General inquiry",
] as const;

export type Topic = (typeof TOPICS)[number];

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  topic: Topic;
  message: string;
  /** Honeypot field. Real people leave it empty. */
  website: string;
};

export type FieldName = "name" | "email" | "phone" | "message";
export type FieldErrors = Partial<Record<FieldName, string>>;

export const LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  phoneMax: 30,
  messageMin: 10,
  messageMax: 3000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\-\s]+$/;

/** Runs in the browser (instant feedback) and on the server (the real check). */
export function validateContact(
  input: Pick<ContactPayload, FieldName>,
): FieldErrors {
  const errors: FieldErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const message = input.message.trim();

  if (name.length < LIMITS.nameMin) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.nameMax) errors.name = "That name is too long.";

  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > LIMITS.emailMax || !EMAIL_RE.test(email))
    errors.email = "Please enter a valid email address.";

  if (phone && (phone.length > LIMITS.phoneMax || !PHONE_RE.test(phone)))
    errors.phone = "Please enter a valid phone number, or leave it empty.";

  if (message.length < LIMITS.messageMin)
    errors.message = "Please write a little more so we can help you.";
  else if (message.length > LIMITS.messageMax)
    errors.message = `Please keep your message under ${LIMITS.messageMax} characters.`;

  return errors;
}
