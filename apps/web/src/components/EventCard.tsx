import { Link } from 'react-router';
import { formatBadge, formatEventWhen } from '../lib/format';
import type { EventItem } from '../lib/types';
import { Button } from './Button';
import { Card } from './Card';
import jellyfish from '../assets/jellyfish_skyblue.png';

// The whole card opens the event page (stretched link on the title). The registration button
// sits above that link so it stays independently clickable.
export function EventCard({ event, past = false }: { event: EventItem; past?: boolean }) {
  const badge = formatBadge(event.startsAt);

  return (
    <Card interactive className="flex flex-col">
      {event.imageUrl ? (
        <img
          src={event.imageUrl}
          alt=""
          loading="lazy"
          className="border-wave-blue aspect-video w-full border-b-4 object-cover"
        />
      ) : (
        <div className="from-wave-sky to-wave-offwhite border-wave-blue flex aspect-video w-full items-center justify-center overflow-hidden border-b-4 bg-radial">
          <img src={jellyfish} alt="" className="h-full object-contain opacity-60" />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start gap-4">
          <div className="bg-wave-yellow/70 flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl leading-none">
            <span className="font-display text-3xl">{badge.day}</span>
            <span className="text-lg">{badge.month}</span>
          </div>
          <h3 className="font-display text-wave-blue text-2xl leading-tight tracking-normal">
            <Link
              to={`/evenements/${event.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {event.title}
            </Link>
          </h3>
        </div>
        <p>{formatEventWhen(event.startsAt, event.endsAt)}</p>
        <p className="text-wave-blue">{event.location}</p>

        <div className="relative mt-auto pt-3">
          {past ? (
            <span className="text-wave-gray">Événement terminé</span>
          ) : (
            event.registrationUrl && (
              <Button href={event.registrationUrl} size="sm">
                S’inscrire
              </Button>
            )
          )}
        </div>
      </div>
    </Card>
  );
}
