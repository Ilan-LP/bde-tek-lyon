import type { ReactNode } from 'react';
import { errorMessage } from '../lib/api';
import type { ApiResult } from '../lib/useApi';
import { Button } from './Button';
import { CardGridSkeleton } from './Skeleton';
import { StateMessage } from './StateMessage';

type DataViewProps<T> = {
  result: ApiResult<T>;
  children: (data: T) => ReactNode;
  /** Shown instead of the content when `isEmpty` returns true. */
  isEmpty?: (data: T) => boolean;
  empty?: ReactNode;
  /** Shown instead of the generic error when the API answers 404. */
  notFound?: ReactNode;
  /** Shown while loading; defaults to a grid of card placeholders. */
  skeleton?: ReactNode;
};

// Handles the three states every API-backed section has: loading (skeleton), error (with retry), empty.
export function DataView<T>({
  result,
  children,
  isEmpty,
  empty,
  notFound,
  skeleton,
}: DataViewProps<T>) {
  const { data, error, loading, reload } = result;

  if (loading) return <>{skeleton ?? <CardGridSkeleton />}</>;
  if (error) {
    if (error.status === 404 && notFound) return <>{notFound}</>;
    return (
      <div role="alert">
        <StateMessage
          action={
            <Button size="sm" variant="secondary" onClick={reload}>
              Réessayer
            </Button>
          }
        >
          {errorMessage(error)}
        </StateMessage>
      </div>
    );
  }
  if (data === undefined) return null;
  if (isEmpty?.(data)) return <StateMessage>{empty}</StateMessage>;
  return <>{children(data)}</>;
}
