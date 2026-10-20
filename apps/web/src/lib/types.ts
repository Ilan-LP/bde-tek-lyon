// Shapes returned by the public API routes (apps/api/src/routes/*). Dates are ISO strings.

export type EventItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  startsAt: string;
  endsAt: string | null;
  location: string;
  imageUrl: string | null;
  registrationUrl: string | null;
};

export type Club = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  contactEmail: string | null;
};

export type Partner = {
  id: string;
  name: string;
  description: string;
  advantage: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
};
