import type { ReactNode } from 'react';
import { errorMessage } from '../lib/api';
import type { ApiResult } from '../lib/useApi';
import { Button } from './Button';
import { Card } from './Card';

type DataViewProps<T> = {
  result: ApiResult<T>;
  children: (data: T) => ReactNode;
  /** Shown instead of the content when `isEmpty` returns true. */
  isEmpty?: (data: T) => boolean;
  empty?: ReactNode;
  /** Shown instead of the generic error when the API answers 404. */
  notFound?: ReactNode;
};

function Message({ children }: { children: ReactNode }) {
  return (
    <Card className="p-8 text-center">
      <div className="mx-auto max-w-xl text-2xl">{children}</div>
    </Card>
  );
}

// Handles the three states every API-backed section has: loading, error (with retry), empty.
export function DataView<T>({ result, children, isEmpty, empty, notFound }: DataViewProps<T>) {
  const { data, error, loading, reload } = result;

  if (loading) {
    return (
      <p
        role="status"
        className="text-wave-blue py-12 text-center text-2xl motion-safe:animate-pulse"
      >
        Chargement…
      </p>
    );
  }
  if (error) {
    if (error.status === 404 && notFound) return <>{notFound}</>;
    return (
      <div role="alert">
        <Message>
          <p>{errorMessage(error)}</p>
          <Button size="sm" onClick={reload} className="mt-5">
            Réessayer
          </Button>
        </Message>
      </div>
    );
  }
  if (data === undefined) return null;
  if (isEmpty?.(data)) return <Message>{empty}</Message>;
  return <>{children(data)}</>;
}
