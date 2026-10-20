// Client-side checks for the admin forms. They mirror the API rules (apps/api/src/lib/validation.ts
// and the zod schemas of each route) to give instant feedback in French. The API stays the
// authority: it validates everything again.

export type FieldErrors = Record<string, string>;

// Required text, 1..max characters once trimmed (API: textSchema).
export function checkRequired(value: string, max: number) {
  const text = value.trim();
  if (!text) return 'Ce champ est obligatoire.';
  if (text.length > max) return `${max} caractères maximum.`;
  return undefined;
}

// Optional text, at most max characters (an empty value is sent as null).
export function checkOptionalText(value: string, max: number) {
  return value.trim().length > max ? `${max} caractères maximum.` : undefined;
}

// Optional http(s) link, at most 2048 characters (API: httpUrlSchema).
export function checkOptionalUrl(value: string) {
  const text = value.trim();
  if (!text) return undefined;
  if (text.length > 2048) return '2048 caractères maximum.';
  try {
    const { protocol } = new URL(text);
    if (protocol !== 'http:' && protocol !== 'https:') throw new Error('not http');
  } catch {
    return 'Saisis un lien complet commençant par http:// ou https://.';
  }
  return undefined;
}

// Deliberately simple: something@domain.tld. The API applies the strict rule.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function checkEmail(value: string) {
  const text = value.trim();
  if (!text) return 'Ce champ est obligatoire.';
  return emailPattern.test(text) ? undefined : 'Saisis une adresse e-mail valide.';
}

export function checkOptionalEmail(value: string) {
  return value.trim() ? checkEmail(value) : undefined;
}

// New password: 12..128 characters (API: passwordSchema).
export function checkNewPassword(value: string) {
  if (!value) return 'Ce champ est obligatoire.';
  if (value.length < 12) return '12 caractères minimum.';
  if (value.length > 128) return '128 caractères maximum.';
  return undefined;
}

// Optional fields are sent as null when left blank (null clears the value on update).
export function blankToNull(value: string) {
  const text = value.trim();
  return text === '' ? null : text;
}

// Keeps only the fields that failed: { title: undefined, ... } -> {}.
export function collectErrors(checks: Record<string, string | undefined>) {
  const errors: FieldErrors = {};
  for (const [field, message] of Object.entries(checks)) {
    if (message) errors[field] = message;
  }
  return errors;
}
