import { useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import logo from '../../assets/wave_logo_blue.png';
import { FormShell } from '../../components/admin/FormShell';
import { TextField } from '../../components/admin/fields';
import { checkEmail, collectErrors } from '../../lib/adminValidation';
import { useAuth } from '../../lib/auth';
import { useAdminForm } from '../../lib/useAdminForm';
import { useAdminTitle } from '../../lib/useAdminTitle';

export function AdminLoginPage() {
  useAdminTitle('Connexion');
  const { state, login } = useAuth();
  const location = useLocation() as { state: { from?: string } | null };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const form = useAdminForm({
    validate: () =>
      collectErrors({
        email: checkEmail(email),
        // No length rule on login: it only applies when a password is created.
        password: password ? undefined : 'Ce champ est obligatoire.',
      }),
    save: () => login(email.trim(), password),
    onSaved: () => undefined, // the redirect below happens as soon as the state is "authenticated"
  });

  // Back to the page that sent us here, but only inside the admin area.
  const from = location.state?.from;
  const target = from?.startsWith('/admin') && !from.startsWith('/admin/login') ? from : '/admin';

  if (state.status === 'authenticated') return <Navigate to={target} replace />;
  if (state.status === 'loading') {
    return (
      <p
        role="status"
        className="text-wave-blue py-24 text-center text-2xl motion-safe:animate-pulse"
      >
        Chargement…
      </p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-10">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <img src={logo} alt="Logo BDE Wave" className="drop-shadow-logo h-24 w-auto" />
        <h1 className="font-display text-wave-blue text-4xl leading-tight tracking-normal md:text-5xl">
          Administration
        </h1>
        <p className="text-2xl">Connecte-toi pour gérer le site du BDE.</p>
      </div>

      <FormShell
        onSubmit={form.onSubmit}
        saving={form.saving}
        error={form.formError}
        submitLabel="Se connecter"
      >
        <TextField
          label="Adresse e-mail"
          type="email"
          autoComplete="username"
          value={email}
          onChange={setEmail}
          error={form.errors.email}
          required
        />
        <TextField
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          error={form.errors.password}
          required
        />
      </FormShell>
    </div>
  );
}
