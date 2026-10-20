import type { FormEventHandler, ReactNode } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { Alert } from './Alert';

// Card around the fields of a form, with the error banner and the Save / Cancel buttons.
// `noValidate`: the French messages come from our own checks, not the browser's.
export function FormShell({
  children,
  onSubmit,
  saving,
  error,
  cancelTo,
  submitLabel = 'Enregistrer',
}: {
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  saving: boolean;
  error?: string;
  /** Where "Annuler" goes. Leave out for inline forms that have no cancel button. */
  cancelTo?: string;
  submitLabel?: string;
}) {
  return (
    <form noValidate onSubmit={onSubmit}>
      <Card className="flex flex-col gap-6 p-6 md:p-8">
        {children}
        {error && <Alert tone="error">{error}</Alert>}
        <div className="flex flex-wrap gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? 'Enregistrement…' : submitLabel}
          </Button>
          {cancelTo && <Button to={cancelTo}>Annuler</Button>}
        </div>
      </Card>
    </form>
  );
}
