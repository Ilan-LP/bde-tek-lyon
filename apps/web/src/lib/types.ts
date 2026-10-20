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

// Shapes returned by the admin routes (/api/admin/*, /api/admins): the public fields plus
// the publication flag and timestamps.
type AdminFields = { published: boolean; createdAt: string; updatedAt: string };

export type AdminEvent = EventItem & AdminFields;
export type AdminClub = Club & AdminFields;
export type AdminPartner = Partner & AdminFields;

// A logged-in admin as returned by /api/auth/me and /api/auth/login.
export type AdminSession = { id: string; email: string };

// An admin account as listed by GET /api/admins (never contains the password).
export type AdminUser = AdminSession & { createdAt: string };
