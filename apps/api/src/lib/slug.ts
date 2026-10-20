// "Soirée d'intégration 2026!" -> "soiree-d-integration-2026"
export function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // drop accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
}

// Builds a slug from `text` and adds -2, -3... until `isTaken` says it is free.
// The unique constraint in the database stays the final guard (a rare race gives a 409).
export async function uniqueSlug(text: string, isTaken: (slug: string) => Promise<boolean>) {
  const base = slugify(text) || 'item';
  let slug = base;
  for (let n = 2; await isTaken(slug); n++) {
    slug = `${base}-${n}`;
  }
  return slug;
}
