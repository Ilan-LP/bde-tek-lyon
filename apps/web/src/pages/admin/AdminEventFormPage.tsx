import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { FormShell } from '../../components/admin/FormShell';
import { ImageField } from '../../components/admin/ImageField';
import { ItemLoader } from '../../components/admin/ItemLoader';
import { CheckboxField, TextField } from '../../components/admin/fields';
import {
  blankToNull,
  checkOptionalUrl,
  checkRequired,
  collectErrors,
} from '../../lib/adminValidation';
import { saveItem } from '../../lib/api';
import { inputValueToIso, isoToInputValue } from '../../lib/datetime';
import type { AdminEvent } from '../../lib/types';
import { useAdminForm } from '../../lib/useAdminForm';

const ENDPOINT = '/api/admin/events';
const LIST_PATH = '/admin/evenements';

function EventForm({ event }: { event?: AdminEvent }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(event?.title ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [startsAt, setStartsAt] = useState(isoToInputValue(event?.startsAt));
  const [endsAt, setEndsAt] = useState(isoToInputValue(event?.endsAt));
  const [location, setLocation] = useState(event?.location ?? '');
  const [imageUrl, setImageUrl] = useState(event?.imageUrl ?? null);
  const [registrationUrl, setRegistrationUrl] = useState(event?.registrationUrl ?? '');
  const [published, setPublished] = useState(event?.published ?? false);

  // The date inputs are in Paris time; the API wants ISO instants.
  const startIso = inputValueToIso(startsAt);
  const endIso = inputValueToIso(endsAt);

  const form = useAdminForm({
    validate: () =>
      collectErrors({
        title: checkRequired(title, 200),
        description: checkRequired(description, 5000),
        startsAt: !startsAt ? 'Ce champ est obligatoire.' : startIso ? undefined : 'Date invalide.',
        endsAt:
          endsAt && !endIso
            ? 'Date invalide.'
            : startIso && endIso && endIso < startIso
              ? 'La fin ne peut pas être avant le début.'
              : undefined,
        location: checkRequired(location, 200),
        registrationUrl: checkOptionalUrl(registrationUrl),
      }),
    save: () =>
      saveItem(ENDPOINT, event?.id, {
        title: title.trim(),
        description: description.trim(),
        startsAt: startIso,
        endsAt: endIso, // null clears the end date
        location: location.trim(),
        imageUrl,
        registrationUrl: blankToNull(registrationUrl),
        published,
      }),
    onSaved: () => navigate(LIST_PATH, { state: { notice: 'Événement enregistré.' } }),
  });

  return (
    <FormShell
      onSubmit={form.onSubmit}
      saving={form.saving}
      error={form.formError}
      cancelTo={LIST_PATH}
    >
      <TextField
        label="Titre"
        value={title}
        onChange={setTitle}
        error={form.errors.title}
        required
      />
      <TextField
        label="Description"
        rows={6}
        value={description}
        onChange={setDescription}
        error={form.errors.description}
        required
      />
      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          label="Début"
          type="datetime-local"
          value={startsAt}
          onChange={setStartsAt}
          error={form.errors.startsAt}
          hint="Heure de Paris."
          required
        />
        <TextField
          label="Fin"
          type="datetime-local"
          value={endsAt}
          onChange={setEndsAt}
          error={form.errors.endsAt}
          hint="Facultatif."
        />
      </div>
      <TextField
        label="Lieu"
        value={location}
        onChange={setLocation}
        error={form.errors.location}
        required
      />
      <ImageField
        label="Image"
        value={imageUrl}
        onChange={setImageUrl}
        error={form.errors.imageUrl}
      />
      <TextField
        label="Lien d’inscription"
        type="url"
        value={registrationUrl}
        onChange={setRegistrationUrl}
        error={form.errors.registrationUrl}
        hint="Facultatif. Lien complet, par exemple vers HelloAsso."
        placeholder="https://"
      />
      <CheckboxField
        label="Publié"
        hint="Un événement publié est visible sur le site public."
        checked={published}
        onChange={setPublished}
      />
    </FormShell>
  );
}

export function AdminEventFormPage() {
  const { id } = useParams();

  return (
    <div>
      <AdminPageHeader title={id ? 'Modifier l’événement' : 'Nouvel événement'} />
      {id ? (
        <ItemLoader<AdminEvent> endpoint={ENDPOINT} id={id} backTo={LIST_PATH}>
          {(event) => <EventForm key={event.id} event={event} />}
        </ItemLoader>
      ) : (
        <EventForm />
      )}
    </div>
  );
}
