import { config } from './config';

// An API call that failed. status 0 means the server could not be reached at all.
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, code: string) {
    super(code);
    this.status = status;
  }
}

// Small GET client for the public routes. Throws an ApiError on any failure.
export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${config.apiUrl}${path}`, { signal });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError(0, 'network_error');
  }

  if (!response.ok) {
    // The API answers errors as { "error": "<english_code>" }.
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(response.status, body?.error ?? 'unknown_error');
  }
  return (await response.json()) as T;
}

// User-facing (French) message for a failed call.
export function errorMessage(error: ApiError) {
  if (error.status === 0) {
    return 'Impossible de joindre le serveur. Vérifie ta connexion et réessaie.';
  }
  if (error.status === 404) return 'Ce contenu est introuvable.';
  return 'Une erreur est survenue de notre côté. Réessaie dans un instant.';
}
