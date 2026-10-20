import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { ApiError, apiRequest, setUnauthorizedHandler } from './api';
import type { AdminSession } from './types';

type AuthState =
  | { status: 'loading' }
  | { status: 'anonymous'; loggedOut?: boolean } // loggedOut: the user clicked "Se déconnecter"
  | { status: 'error' } // /api/auth/me could not be answered (server down...): not the same as logged out
  | { status: 'authenticated'; admin: AdminSession };

type AuthValue = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  retry: () => void;
};

const AuthContext = createContext<AuthValue | undefined>(undefined);

// Knows who is logged in. Only mounted around the admin area: the public site never calls
// /api/auth/me. The session itself lives in the httpOnly cookie, JavaScript never sees it.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  // Ask the API who we are (GET /api/auth/me): 401 means nobody is logged in.
  useEffect(() => {
    const controller = new AbortController();
    apiRequest<AdminSession>('/api/auth/me', { credentials: true, signal: controller.signal }).then(
      (admin) => setState({ status: 'authenticated', admin }),
      (error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: error instanceof ApiError && error.status === 401 ? 'anonymous' : 'error',
        });
      },
    );
    return () => controller.abort();
  }, [attempt]);

  // Any admin call answered 401 later on (expired session) logs the user out of the UI.
  useEffect(() => {
    setUnauthorizedHandler(() => setState({ status: 'anonymous' }));
    return () => setUnauthorizedHandler(undefined);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const admin = await apiRequest<AdminSession>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      credentials: true,
    });
    setState({ status: 'authenticated', admin });
  }, []);

  const logout = useCallback(async () => {
    await apiRequest('/api/auth/logout', { method: 'POST', credentials: true });
    setState({ status: 'anonymous', loggedOut: true });
  }, []);

  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  return <AuthContext value={{ state, login, logout, retry }}>{children}</AuthContext>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}

// Admin pages only render behind the route guard, so a session always exists there.
export function useAdminSession() {
  const { state } = useAuth();
  if (state.status !== 'authenticated') throw new Error('No admin session');
  return state.admin;
}
