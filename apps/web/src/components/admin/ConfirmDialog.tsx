import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from '../Button';

// Confirmation modal built on the native <dialog>: focus stays inside, Escape cancels.
// Mount it only while a confirmation is pending: `{target && <ConfirmDialog ... />}`.
export function ConfirmDialog({
  title,
  children,
  confirmLabel,
  busy = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      onCancel={(event) => {
        event.preventDefault(); // we unmount it ourselves
        if (!busy) onCancel();
      }}
      className="border-wave-blue bg-wave-offwhite text-wave-navy backdrop:bg-wave-navy/40 m-auto w-[calc(100%-2rem)] max-w-lg rounded-3xl border-4 p-6 backdrop:backdrop-blur-sm md:p-8"
    >
      <h2 id="confirm-title" className="font-display text-wave-blue text-3xl leading-tight">
        {title}
      </h2>
      <div className="mt-4 text-2xl">{children}</div>
      <div className="mt-8 flex flex-wrap justify-end gap-4">
        <Button size="sm" disabled={busy} onClick={onCancel}>
          Annuler
        </Button>
        <Button size="sm" disabled={busy} onClick={onConfirm}>
          {busy ? 'Suppression…' : confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
