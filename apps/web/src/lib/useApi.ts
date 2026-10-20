import { useCallback, useEffect, useState } from 'react';
import { ApiError, apiGet } from './api';

export type ApiResult<T> = {
  data: T | undefined;
  error: ApiError | undefined;
  loading: boolean;
  reload: () => void;
};

type Settled<T> = { key: string; data?: T; error?: ApiError };

// Loads `path` from the API and reloads when it changes (or when reload() is called).
// The result is tagged with the request it belongs to, so a stale answer is never shown
// for a newer path and "loading" needs no state update inside the effect.
export function useApi<T>(path: string): ApiResult<T> {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T>>({ key: '' });
  const key = `${attempt}:${path}`;

  useEffect(() => {
    const controller = new AbortController();
    apiGet<T>(path, controller.signal).then(
      (data) => setSettled({ key, data }),
      (error: unknown) => {
        if (controller.signal.aborted) return;
        setSettled({ key, error: error instanceof ApiError ? error : new ApiError(0, 'unknown') });
      },
    );
    return () => controller.abort();
  }, [key, path]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  const current = settled.key === key;
  return {
    data: current ? settled.data : undefined,
    error: current ? settled.error : undefined,
    loading: !current,
    reload,
  };
}
