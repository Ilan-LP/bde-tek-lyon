import { Link } from 'react-router';
import jellyfish from '../assets/jellyfish_skyblue.png';
import { formatBadge, formatEventWhen } from '../lib/format';
import type { EventItem } from '../lib/types';
import { Button } from './Button';
import { Card } from './Card';

// The whole card opens the event page (stretched link on the title). The registration button
// sits above that link so it stays independently clickable.
export function EventCard({ event, past = false }: { event: EventItem; past?: boolean }) {
  const badge = formatBadge(event.startsAt);

  return (
    <Card interactive className="flex w-full flex-col">
      {event.imageUrl ? (
        <img
          src={event.imageUrl}
          alt=""
          loading="lazy"
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div className="from-wave-navy to-wave-blue flex aspect-video w-full items-center justify-center overflow-hidden bg-linear-to-br">
          <img
            src={jellyfish}
            alt=""
            aria-hidden="true"
            className="h-4/5 w-auto object-contain opacity-60"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <span
          className={[
            'font-label tracking-wave text-wave-navy w-fit rounded-full px-3 py-0.5 text-lg',
            past ? 'bg-wave-beige' : 'bg-wave-yellow',
          ].join(' ')}
        >
          {badge.day} {badge.month}
        </span>
        <h3 className="text-wave-navy text-xl leading-snug font-semibold">
          <Link
            to={`/evenements/${event.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {event.title}
          </Link>
        </h3>
        <p className="text-wave-muted text-base">{formatEventWhen(event.startsAt, event.endsAt)}</p>
        <p className="text-wave-blue text-base font-semibold">{event.location}</p>

        <div className="relative mt-auto pt-2">
          {past ? (
            <span className="text-wave-muted text-base">Événement terminé</span>
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
