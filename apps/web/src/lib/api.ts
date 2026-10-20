import { config } from './config';

// One validation problem reported by the API ({ path: "title", message: "..." }).
export type ApiIssue = { path: string; message: string };

// An API call that failed. status 0 means the server could not be reached at all.
export class ApiError extends Error {
  readonly status: number;
  /** Stable English code sent by the API, e.g. "invalid_credentials". */
  readonly code: string;
  readonly issues: ApiIssue[];

  constructor(status: number, code: string, issues: ApiIssue[] = []) {
    super(code);
    this.status = status;
    this.code = code;
    this.issues = issues;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  /** Sent as JSON. */
  body?: unknown;
  /** Sent as multipart/form-data (image upload). */
  form?: FormData;
  /** Send the session cookie. Needed for every admin call, never for the public routes. */
  credentials?: boolean;
  signal?: AbortSignal;
};

// Called when a logged-in call is answered 401 (the session expired): the admin area then
// sends the user back to the login page. Registered by the AuthProvider.
let unauthorizedHandler: (() => void) | undefined;
export function setUnauthorizedHandler(handler: (() => void) | undefined) {
  unauthorizedHandler = handler;
}

// Small fetch client. Throws an ApiError on any failure and returns undefined on 204.
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, form, credentials = false, signal } = options;

  const init: RequestInit = { method, signal };
  if (credentials) init.credentials = 'include';
  if (form) {
    init.body = form; // the browser sets the multipart Content-Type (with its boundary) itself
  } else if (body !== undefined) {
    init.headers = { 'Content-Type': 'application/json' };
    init.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${config.apiUrl}${path}`, init);
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError(0, 'network_error');
  }

  if (!response.ok) {
    // The API answers errors as { "error": "<english_code>", "issues"?: [...] }.
    const failure = (await response.json().catch(() => null)) as {
      error?: string;
      issues?: ApiIssue[];
    } | null;
    // /api/auth/* answers 401 on purpose (wrong password, nobody logged in yet): not an expiry.
    if (response.status === 401 && credentials && !path.startsWith('/api/auth/')) {
      unauthorizedHandler?.();
    }
    throw new ApiError(response.status, failure?.error ?? 'unknown_error', failure?.issues);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

// Public GET (no cookie).
export function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  return apiRequest<T>(path, { signal });
}

// Uploads one image and returns its public URL (POST /api/admin/upload).
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('image', file);
  const { url } = await apiRequest<{ url: string }>('/api/admin/upload', {
    method: 'POST',
    form,
    credentials: true,
  });
  return url;
}

// French messages for the stable API error codes.
const messages: Record<string, string> = {
  invalid_credentials: 'E-mail ou mot de passe incorrect.',
  too_many_attempts: 'Trop de tentatives échouées. Réessaie dans 15 minutes.',
  unauthorized: 'Ta session a expiré. Reconnecte-toi.',
  validation_error: 'Certaines informations sont invalides. Vérifie le formulaire.',
  email_taken: 'Cette adresse e-mail est déjà utilisée par un administrateur.',
  invalid_current_password: 'Le mot de passe actuel est incorrect.',
  cannot_delete_self: 'Tu ne peux pas supprimer ton propre compte.',
  last_admin: 'Impossible de supprimer le dernier administrateur.',
  conflict_retry: 'Une autre suppression était en cours. Réessaie.',
  conflict: 'Un conflit est survenu pendant l’enregistrement. Réessaie.',
  file_missing: 'Aucun fichier reçu. Choisis une image.',
  file_too_large: 'L’image dépasse 2 Mo.',
  unsupported_file_type: 'Format non pris en charge. Utilise une image JPEG, PNG ou WebP.',
  invalid_upload: 'Le fichier n’a pas pu être envoyé. Réessaie.',
};

// User-facing (French) message for a failed call.
export function errorMessage(error: unknown) {
  if (!(error instanceof ApiError)) {
    return 'Une erreur est survenue de notre côté. Réessaie dans un instant.';
  }
  if (error.status === 0) {
    return 'Impossible de joindre le serveur. Vérifie ta connexion et réessaie.';
  }
  const known = messages[error.code];
  if (known) return known;
  if (error.status === 404) return 'Ce contenu est introuvable.';
  return 'Une erreur est survenue de notre côté. Réessaie dans un instant.';
}

// Create (no id) or update (PATCH, with the id) an admin item.
export function saveItem(endpoint: string, id: string | undefined, body: unknown) {
  return apiRequest<void>(id ? `${endpoint}/${id}` : endpoint, {
    method: id ? 'PATCH' : 'POST',
    body,
    credentials: true,
  });
}
