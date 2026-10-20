import { useId, type ReactNode } from 'react';

const controlClasses = [
  'w-full rounded-2xl border-4 bg-wave-offwhite/70 px-4 py-2 text-xl text-wave-navy',
  'placeholder:text-wave-gray',
].join(' ');

// Label, hint and error message around one control, wired together for screen readers.
function FieldFrame({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-wave-blue mb-1 block text-2xl">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-lg">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="bg-wave-pink text-wave-navy mt-2 rounded-xl px-3 py-1">
          {error}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'url' | 'password' | 'datetime-local';
  /** Renders a multi-line textarea of this many rows instead of a single line. */
  rows?: number;
  autoComplete?: string;
  placeholder?: string;
};

// Text input / textarea in the brand style: 4px Main Blue outline, off-white fill.
export function TextField({
  label,
  value,
  onChange,
  error,
  hint,
  required,
  type = 'text',
  rows,
  autoComplete,
  placeholder,
}: TextFieldProps) {
  const id = useId();
  const shared = {
    id,
    value,
    placeholder,
    autoComplete,
    'aria-invalid': error ? true : undefined,
    'aria-describedby':
      [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined,
    className: `${controlClasses} ${error ? 'border-wave-navy' : 'border-wave-blue'}`,
  };

  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} required={required}>
      {rows ? (
        <textarea {...shared} rows={rows} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input {...shared} type={type} onChange={(event) => onChange(event.target.value)} />
      )}
    </FieldFrame>
  );
}

// Single yes/no choice, e.g. "Publié".
export function CheckboxField({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-center gap-3 text-2xl">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="border-wave-blue bg-wave-offwhite/70 accent-wave-blue h-7 w-7 shrink-0 cursor-pointer rounded-lg border-4"
        />
        <span className="text-wave-blue">{label}</span>
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-lg">
          {hint}
        </p>
      )}
    </div>
  );
}
