import { useCallback, useEffect, useState } from 'react';
import { ApiError, apiRequest } from './api';

export type ApiResult<T> = {
  data: T | undefined;
  error: ApiError | undefined;
  loading: boolean;
  reload: () => void;
};

type Settled<T> = { path: string; attempt: number; data?: T; error?: ApiError };

type UseApiOptions = {
  /** Send the session cookie (admin routes). */
  admin?: boolean;
};

// Loads `path` from the API and reloads when it changes (or when reload() is called).
// The result is tagged with the request it belongs to, so a stale answer is never shown
// for a newer path and "loading" needs no state update inside the effect.
// reload() keeps showing the previous data while the fresh answer loads (no flash of "Chargement…").
export function useApi<T>(path: string, { admin = false }: UseApiOptions = {}): ApiResult<T> {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T>>({ path: '', attempt: -1 });

  useEffect(() => {
    const controller = new AbortController();
    apiRequest<T>(path, { credentials: admin, signal: controller.signal }).then(
      (data) => setSettled({ path, attempt, data }),
      (error: unknown) => {
        if (controller.signal.aborted) return;
        setSettled({
          path,
          attempt,
          error: error instanceof ApiError ? error : new ApiError(0, 'unknown'),
        });
      },
    );
    return () => controller.abort();
  }, [attempt, path, admin]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  const fresh = settled.path === path && settled.attempt === attempt;
  const keepPrevious = settled.path === path && settled.data !== undefined;
  return {
    data: fresh || keepPrevious ? settled.data : undefined,
    error: fresh ? settled.error : undefined,
    loading: !fresh && !keepPrevious,
    reload,
  };
}
