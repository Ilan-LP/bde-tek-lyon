// Builds a mailto: link with a prefilled subject and body.
// encodeURIComponent keeps accents and line breaks intact (\n becomes %0A).
export function mailto(to: string, subject: string, body?: string) {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${to}?${params.join('&')}`;
}
