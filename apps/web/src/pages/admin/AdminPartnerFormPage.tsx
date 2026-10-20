import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { FormShell } from '../../components/admin/FormShell';
import { ImageField } from '../../components/admin/ImageField';
import { ItemLoader } from '../../components/admin/ItemLoader';
import { CheckboxField, TextField } from '../../components/admin/fields';
import {
  blankToNull,
  checkOptionalText,
  checkOptionalUrl,
  checkRequired,
  collectErrors,
} from '../../lib/adminValidation';
import { saveItem } from '../../lib/api';
import type { AdminPartner } from '../../lib/types';
import { useAdminForm } from '../../lib/useAdminForm';

const ENDPOINT = '/api/admin/partners';
const LIST_PATH = '/admin/partenaires';

function PartnerForm({ partner }: { partner?: AdminPartner }) {
  const navigate = useNavigate();
  const [name, setName] = useState(partner?.name ?? '');
  const [description, setDescription] = useState(partner?.description ?? '');
  const [advantage, setAdvantage] = useState(partner?.advantage ?? '');
  const [logoUrl, setLogoUrl] = useState(partner?.logoUrl ?? null);
  const [websiteUrl, setWebsiteUrl] = useState(partner?.websiteUrl ?? '');
  const [published, setPublished] = useState(partner?.published ?? false);

  const form = useAdminForm({
    validate: () =>
      collectErrors({
        name: checkRequired(name, 100),
        description: checkRequired(description, 5000),
        advantage: checkOptionalText(advantage, 500),
        websiteUrl: checkOptionalUrl(websiteUrl),
      }),
    save: () =>
      saveItem(ENDPOINT, partner?.id, {
        name: name.trim(),
        description: description.trim(),
        advantage: blankToNull(advantage),
        logoUrl,
        websiteUrl: blankToNull(websiteUrl),
        published,
      }),
    onSaved: () => navigate(LIST_PATH, { state: { notice: 'Partenaire enregistré.' } }),
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
      <TextField
        label="Avantage étudiant"
        rows={3}
        value={advantage}
        onChange={setAdvantage}
        error={form.errors.advantage}
        hint="Facultatif. Par exemple : -10 % sur présentation de la carte étudiante."
      />
      <ImageField label="Logo" value={logoUrl} onChange={setLogoUrl} error={form.errors.logoUrl} />
      <TextField
        label="Site web"
        type="url"
        value={websiteUrl}
        onChange={setWebsiteUrl}
        error={form.errors.websiteUrl}
        hint="Facultatif. Lien complet."
        placeholder="https://"
      />
      <CheckboxField
        label="Publié"
        hint="Un partenaire publié est visible sur le site public."
        checked={published}
        onChange={setPublished}
      />
    </FormShell>
  );
}

export function AdminPartnerFormPage() {
  const { id } = useParams();

  return (
    <div>
      <AdminPageHeader title={id ? 'Modifier le partenaire' : 'Nouveau partenaire'} />
      {id ? (
        <ItemLoader<AdminPartner> endpoint={ENDPOINT} id={id} backTo={LIST_PATH}>
          {(partner) => <PartnerForm key={partner.id} partner={partner} />}
        </ItemLoader>
      ) : (
        <PartnerForm />
      )}
    </div>
  );
}
