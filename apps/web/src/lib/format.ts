// Dates are shown in French, in the school's time zone, whatever the visitor's computer says.
const timeZone = 'Europe/Paris';

const dayFormat = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone,
});
const timeFormat = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone,
});
const badgeDayFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', timeZone });
const badgeMonthFormat = new Intl.DateTimeFormat('fr-FR', { month: 'short', timeZone });

// "samedi 31 octobre 2026 · 18:30 – 22:00" (or two full dates when the event spans several days).
export function formatEventWhen(startsAt: string, endsAt: string | null) {
  const start = new Date(startsAt);
  const startDay = dayFormat.format(start);
  const startTime = timeFormat.format(start);
  if (!endsAt) return `${startDay} · ${startTime}`;

  const end = new Date(endsAt);
  const endDay = dayFormat.format(end);
  const endTime = timeFormat.format(end);
  if (endDay === startDay) {
    return endTime === startTime
      ? `${startDay} · ${startTime}`
      : `${startDay} · ${startTime} – ${endTime}`;
  }
  return `${startDay} · ${startTime} → ${endDay} · ${endTime}`;
}

// Small calendar badge: day number and short month ("31", "oct.").
export function formatBadge(startsAt: string) {
  const start = new Date(startsAt);
  return { day: badgeDayFormat.format(start), month: badgeMonthFormat.format(start) };
}

const dateOnlyFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeZone });

// "5 nov. 2026" (admin lists).
export function formatDate(iso: string) {
  return dateOnlyFormat.format(new Date(iso));
}
