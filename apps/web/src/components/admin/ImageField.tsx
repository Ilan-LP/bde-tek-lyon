import { useId, useRef, useState } from 'react';
import { errorMessage, uploadImage } from '../../lib/api';
import { Button } from '../Button';
import { Alert } from './Alert';

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // same limit as the API
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Image picker: uploads the chosen file right away (POST /api/admin/upload) and keeps the
// returned public URL as the field value. Shows a preview of the current image.
export function ImageField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  /** Public URL of the current image, or null. */
  value: string | null;
  onChange: (url: string | null) => void;
  error?: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();

  async function onFileChosen(file: File | undefined) {
    if (!file) return;
    setUploadError(undefined);

    // Same rules as the API (it checks the real content again), for an instant answer.
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadError('Format non pris en charge. Utilise une image JPEG, PNG ou WebP.');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setUploadError('L’image dépasse 2 Mo.');
      return;
    }

    setUploading(true);
    try {
      onChange(await uploadImage(file));
    } catch (failure) {
      setUploadError(errorMessage(failure));
    } finally {
      setUploading(false);
      // Forget the file so choosing the same one again still triggers a change.
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <p id={`${id}-label`} className="text-wave-blue mb-1 text-2xl">
        {label}
      </p>
      <div className="border-wave-blue bg-wave-offwhite/50 flex flex-col gap-4 rounded-2xl border-4 p-4 sm:flex-row sm:items-center">
        <div className="border-wave-blue bg-wave-offwhite/70 flex h-32 w-48 shrink-0 items-center justify-center overflow-hidden rounded-xl border-4">
          {value ? (
            <img src={value} alt="Aperçu de l’image" className="h-full w-full object-contain" />
          ) : (
            <span className="text-wave-gray px-2 text-center text-lg">Aucune image</span>
          )}
        </div>
        <div className="flex flex-col items-start gap-3">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            hidden
            aria-labelledby={`${id}-label`}
            onChange={(event) => void onFileChosen(event.target.files?.[0])}
          />
          <div className="flex flex-wrap gap-3">
            <Button size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
              {value ? 'Remplacer l’image' : 'Choisir une image'}
            </Button>
            {value && (
              <Button size="sm" disabled={uploading} onClick={() => onChange(null)}>
                Retirer
              </Button>
            )}
          </div>
          <p className="text-lg">JPEG, PNG ou WebP · 2 Mo maximum.</p>
          {uploading && (
            <p role="status" className="text-wave-blue text-lg motion-safe:animate-pulse">
              Envoi en cours…
            </p>
          )}
        </div>
      </div>
      {uploadError && (
        <Alert tone="error" className="mt-2">
          {uploadError}
        </Alert>
      )}
      {error && <p className="bg-wave-pink text-wave-navy mt-2 rounded-xl px-3 py-1">{error}</p>}
    </div>
  );
}
