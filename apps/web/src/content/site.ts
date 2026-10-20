// All the editable texts of the site in one place.
// Everything the BDE still has to provide is written "À COMPLÉTER": search for it in this
// folder and in src/pages to find every placeholder.

export const site = {
  name: 'BDE Wave',
  school: 'Epitech Lyon',
  fullTitle: 'BDE Wave – Epitech Lyon',
  season: '2026-2027',
  tagline: 'Le bureau des étudiants d’Epitech Lyon',

  // DRAFT mission text: to be confirmed or rewritten by the bureau.
  mission: [
    'Wave est le BDE d’Epitech Lyon pour l’année 2026-2027. Notre mission : faire vivre le campus, créer du lien entre les étudiants de toutes les promotions et donner à chacun l’envie de s’investir au-delà des cours.',
  ],
  pillars: [
    {
      title: 'Animer',
      text: 'Soirées, rencontres et événements tout au long de l’année.',
    },
    {
      title: 'Fédérer',
      text: 'Des clubs ouverts à tous, pour partager une passion ou en créer une nouvelle.',
    },
    {
      title: 'Soutenir',
      text: 'Des partenaires qui offrent des avantages concrets aux étudiants.',
    },
  ],

  // Members of the bureau. While `name` / `role` are null, the About page shows a placeholder.
  // Replace with real entries, e.g. { name: 'Prénom Nom', role: 'Président·e' }.
  bureau: [
    { name: null, role: null },
    { name: null, role: null },
    { name: null, role: null },
  ] as { name: string | null; role: string | null }[],

  // Legal notice (mentions légales). null = not provided yet, shown as an "À COMPLÉTER" marker.
  legal: {
    legalName: 'Epitech Lyon BDE',
    status: 'Association d’étudiants', // to be completed with the exact legal form (e.g. loi 1901)
    legalForm: null as string | null,
    registeredOffice: null as string | null,
    registrationNumber: null as string | null, // RNA or SIRET
    publicationDirector: null as string | null,
    host: {
      name: null as string | null,
      address: null as string | null,
      contact: null as string | null,
    },
  },
};
