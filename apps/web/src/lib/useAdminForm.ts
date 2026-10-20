import { useState, type FormEvent } from 'react';
import { ApiError, errorMessage } from './api';
import { collectErrors, type FieldErrors } from './adminValidation';

type UseAdminFormOptions = {
  /** Client-side checks: returns the failing fields (see collectErrors). */
  validate: () => FieldErrors;
  /** Sends the data to the API. Throwing an ApiError shows its message. */
  save: () => Promise<void>;
  /** Runs after a successful save (navigate away, reset the fields...). */
  onSaved: () => void;
};

// Submit logic shared by every admin form: validate, save, then show field errors or one banner.
// Nothing is flagged before the first submit; after that the checks re-run as the user types,
// so an error disappears as soon as the field is fixed.
export function useAdminForm({ validate, save, onSaved }: UseAdminFormOptions) {
  const [attempted, setAttempted] = useState(false);
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const [saveError, setSaveError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const clientErrors = attempted ? validate() : {};
  const hasClientErrors = Object.keys(clientErrors).length > 0;
  const errors = { ...serverErrors, ...clientErrors };
  const formError = hasClientErrors
    ? 'Corrige les champs en erreur avant de continuer.'
    : saveError;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;

    setAttempted(true);
    if (Object.keys(validate()).length > 0) return;

    setSaveError(undefined);
    setServerErrors({});
    setSaving(true);
    try {
      await save();
      onSaved();
      // Start clean: an inline form that empties its fields in onSaved must not be flagged.
      setAttempted(false);
    } catch (error) {
      // The API rejected a field the client did not catch: point at it.
      if (error instanceof ApiError && error.issues.length > 0) {
        setServerErrors(
          collectErrors(
            Object.fromEntries(error.issues.map((issue) => [issue.path, 'Valeur invalide.'])),
          ),
        );
      }
      setSaveError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return { errors, formError, saving, onSubmit };
}
