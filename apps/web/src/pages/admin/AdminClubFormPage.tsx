import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { FormShell } from '../../components/admin/FormShell';
import { ImageField } from '../../components/admin/ImageField';
import { ItemLoader } from '../../components/admin/ItemLoader';
import { CheckboxField, TextField } from '../../components/admin/fields';
import {
  blankToNull,
  checkOptionalEmail,
  checkRequired,
  collectErrors,
} from '../../lib/adminValidation';
import { saveItem } from '../../lib/api';
import type { AdminClub } from '../../lib/types';
import { useAdminForm } from '../../lib/useAdminForm';

const ENDPOINT = '/api/admin/clubs';
const LIST_PATH = '/admin/clubs';

function ClubForm({ club }: { club?: AdminClub }) {
  const navigate = useNavigate();
  const [name, setName] = useState(club?.name ?? '');
  const [description, setDescription] = useState(club?.description ?? '');
  const [logoUrl, setLogoUrl] = useState(club?.logoUrl ?? null);
  const [contactEmail, setContactEmail] = useState(club?.contactEmail ?? '');
  const [published, setPublished] = useState(club?.published ?? false);

  const form = useAdminForm({
    validate: () =>
      collectErrors({
        name: checkRequired(name, 100),
        description: checkRequired(description, 5000),
        contactEmail: checkOptionalEmail(contactEmail),
      }),
    save: () =>
      saveItem(ENDPOINT, club?.id, {
        name: name.trim(),
        description: description.trim(),
        logoUrl,
        contactEmail: blankToNull(contactEmail),
        published,
      }),
    onSaved: () => navigate(LIST_PATH, { state: { notice: 'Club enregistré.' } }),
  });

  return (
    <FormShell
      onSubmit={form.onSubmit}
      saving={form.saving}
      error={form.formError}
      cancelTo={LIST_PATH}
    >
      <TextField label="Nom" value={name} onChange={setName} error={form.errors.name} required />
      <TextField
        label="Description"
        rows={6}
        value={description}
        onChange={setDescription}
        error={form.errors.description}
        required
      />
      <ImageField label="Logo" value={logoUrl} onChange={setLogoUrl} error={form.errors.logoUrl} />
      <TextField
        label="E-mail de contact"
        type="email"
        value={contactEmail}
        onChange={setContactEmail}
        error={form.errors.contactEmail}
        hint="Facultatif. Affiché sur la page du club."
      />
      <CheckboxField
        label="Publié"
        hint="Un club publié est visible sur le site public."
        checked={published}
        onChange={setPublished}
      />
    </FormShell>
  );
}

export function AdminClubFormPage() {
  const { id } = useParams();

  return (
    <div>
      <AdminPageHeader title={id ? 'Modifier le club' : 'Nouveau club'} />
      {id ? (
        <ItemLoader<AdminClub> endpoint={ENDPOINT} id={id} backTo={LIST_PATH}>
          {(club) => <ClubForm key={club.id} club={club} />}
        </ItemLoader>
      ) : (
        <ClubForm />
      )}
    </div>
  );
}
