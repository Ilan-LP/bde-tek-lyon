import { useState, type ReactNode } from 'react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Alert } from '../../components/admin/Alert';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { FormShell } from '../../components/admin/FormShell';
import { TextField } from '../../components/admin/fields';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { DataView } from '../../components/DataView';
import { checkEmail, checkNewPassword, collectErrors } from '../../lib/adminValidation';
import { apiRequest, errorMessage } from '../../lib/api';
import { useAdminSession } from '../../lib/auth';
import { formatDate } from '../../lib/format';
import type { AdminUser } from '../../lib/types';
import { useAdminForm } from '../../lib/useAdminForm';
import { useApi } from '../../lib/useApi';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-wave-blue mb-5 text-3xl leading-tight tracking-normal">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function AdminUsersPage() {
  const me = useAdminSession();
  const admins = useApi<AdminUser[]>('/api/admins', { admin: true });
  const [notice, setNotice] = useState<string>();
  const [listError, setListError] = useState<string>();
  const [pendingDelete, setPendingDelete] = useState<AdminUser>();
  const [deleting, setDeleting] = useState(false);

  // ----- Delete an admin. The API refuses to delete yourself or the last admin; we show its answer.
  async function confirmDelete() {
    if (!pendingDelete) return;
    setNotice(undefined);
    setListError(undefined);
    setDeleting(true);
    try {
      await apiRequest(`/api/admins/${pendingDelete.id}`, { method: 'DELETE', credentials: true });
      setNotice(`${pendingDelete.email} a été supprimé.`);
      admins.reload();
    } catch (error) {
      setListError(errorMessage(error));
    } finally {
      setDeleting(false);
      setPendingDelete(undefined);
    }
  }

  // ----- Add an admin.
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const addForm = useAdminForm({
    validate: () =>
      collectErrors({ email: checkEmail(newEmail), password: checkNewPassword(newPassword) }),
    save: () =>
      apiRequest('/api/admins', {
        method: 'POST',
        body: { email: newEmail.trim(), password: newPassword },
        credentials: true,
      }),
    onSaved: () => {
      setNotice(`${newEmail.trim().toLowerCase()} est maintenant administrateur.`);
      setListError(undefined);
      setNewEmail('');
      setNewPassword('');
      admins.reload();
    },
  });

  // ----- Change my own password.
  const [currentPassword, setCurrentPassword] = useState('');
  const [changedPassword, setChangedPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const passwordForm = useAdminForm({
    validate: () =>
      collectErrors({
        currentPassword: currentPassword ? undefined : 'Ce champ est obligatoire.',
        newPassword: checkNewPassword(changedPassword),
        confirmPassword:
          confirmPassword === changedPassword
            ? undefined
            : 'Les deux mots de passe sont différents.',
      }),
    save: () =>
      apiRequest('/api/admins/me/password', {
        method: 'PATCH',
        body: { currentPassword, newPassword: changedPassword },
        credentials: true,
      }),
    onSaved: () => {
      setNotice('Ton mot de passe a été modifié.');
      setCurrentPassword('');
      setChangedPassword('');
      setConfirmPassword('');
    },
  });

  return (
    <div>
      <AdminPageHeader title="Admins" />

      {notice && (
        <Alert tone="success" className="mb-6">
          {notice}
        </Alert>
      )}
      {listError && (
        <Alert tone="error" className="mb-6">
          {listError}
        </Alert>
      )}

      <DataView result={admins}>
        {(list) => (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full min-w-120 border-collapse text-left">
                <thead>
                  <tr className="text-wave-blue border-wave-blue border-b-4 text-xl">
                    <th scope="col" className="px-4 py-3 font-normal">
                      E-mail
                    </th>
                    <th scope="col" className="px-4 py-3 font-normal">
                      Ajouté le
                    </th>
                    <th scope="col" className="px-4 py-3 font-normal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((admin) => (
                    <tr
                      key={admin.id}
                      className="border-wave-blue/30 border-b-2 align-middle last:border-b-0"
                    >
                      <td className="px-4 py-3 break-all">
                        {admin.email}
                        {admin.id === me.id && (
                          <span className="bg-wave-sky/80 text-wave-navy ml-3 rounded-full px-3 py-0.5 text-lg whitespace-nowrap">
                            Toi
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatDate(admin.createdAt)}</td>
                      <td className="px-4 py-3">
                        <Button size="sm" onClick={() => setPendingDelete(admin)}>
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </DataView>

      <Section title="Ajouter un admin">
        <FormShell
          onSubmit={addForm.onSubmit}
          saving={addForm.saving}
          error={addForm.formError}
          submitLabel="Ajouter"
        >
          <TextField
            label="Adresse e-mail"
            type="email"
            autoComplete="off"
            value={newEmail}
            onChange={setNewEmail}
            error={addForm.errors.email}
            required
          />
          <TextField
            label="Mot de passe"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={setNewPassword}
            error={addForm.errors.password}
            hint="12 caractères minimum."
            required
          />
        </FormShell>
      </Section>

      <Section title="Changer mon mot de passe">
        <FormShell
          onSubmit={passwordForm.onSubmit}
          saving={passwordForm.saving}
          error={passwordForm.formError}
          submitLabel="Changer le mot de passe"
        >
          <TextField
            label="Mot de passe actuel"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={setCurrentPassword}
            error={passwordForm.errors.currentPassword}
            required
          />
          <TextField
            label="Nouveau mot de passe"
            type="password"
            autoComplete="new-password"
            value={changedPassword}
            onChange={setChangedPassword}
            error={passwordForm.errors.newPassword}
            hint="12 caractères minimum."
            required
          />
          <TextField
            label="Confirmer le nouveau mot de passe"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={passwordForm.errors.confirmPassword}
            required
          />
        </FormShell>
      </Section>

      {pendingDelete && (
        <ConfirmDialog
          title="Supprimer cet admin ?"
          confirmLabel="Supprimer"
          busy={deleting}
          onConfirm={() => void confirmDelete()}
          onCancel={() => setPendingDelete(undefined)}
        >
          <p>
            {pendingDelete.email} ne pourra plus se connecter à l’administration. Cette action est
            irréversible.
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}
