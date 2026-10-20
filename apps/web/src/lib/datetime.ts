// The event form works in the school's time zone (Europe/Paris), whatever the time zone of the
// admin's computer. <input type="datetime-local"> has no time zone, so we convert by hand.
const timeZone = 'Europe/Paris';

const partsFormat = new Intl.DateTimeFormat('en-US', {
  timeZone,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

// Wall-clock fields of an instant, as seen in Paris.
function parisParts(instant: Date) {
  const parts: Record<string, number> = {};
  for (const part of partsFormat.formatToParts(instant)) {
    if (part.type !== 'literal') parts[part.type] = Number(part.value);
  }
  return parts as Record<'year' | 'month' | 'day' | 'hour' | 'minute', number>;
}

const pad = (value: number) => String(value).padStart(2, '0');

// ISO instant -> "2026-11-05T18:30" (value of a datetime-local input, Paris time).
export function isoToInputValue(iso: string | null | undefined) {
  if (!iso) return '';
  const p = parisParts(new Date(iso));
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

// "2026-11-05T18:30" (Paris time) -> ISO instant such as "2026-11-05T17:30:00.000Z".
// Returns null when the text is not a valid date.
export function inputValueToIso(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const [year, month, day, hour, minute] = match.slice(1).map(Number) as [
    number,
    number,
    number,
    number,
    number,
  ];

  // Read the same wall-clock time as if it were UTC, then subtract Paris's offset at that moment.
  // The offset is computed twice because it depends on the instant being searched (DST changes).
  const wallClockAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  let instant = wallClockAsUtc;
  for (let pass = 0; pass < 2; pass++) {
    const p = parisParts(new Date(instant));
    const offset = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - instant;
    instant = wallClockAsUtc - offset;
  }
  const date = new Date(instant);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
