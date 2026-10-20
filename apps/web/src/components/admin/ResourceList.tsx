import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { apiRequest, errorMessage } from '../../lib/api';
import { useApi } from '../../lib/useApi';
import { Button } from '../Button';
import { Card } from '../Card';
import { DataView } from '../DataView';
import { Alert } from './Alert';
import { AdminPageHeader } from './AdminPageHeader';
import { ConfirmDialog } from './ConfirmDialog';
import { PublishedBadge } from './PublishedBadge';

export type Column<T> = { header: string; cell: (item: T) => ReactNode };

type ResourceListProps<T> = {
  title: string;
  /** API collection, e.g. "/api/admin/events". */
  endpoint: string;
  /** Admin route of the section, e.g. "/admin/evenements": "/nouveau" and "/<id>" are added to it. */
  basePath: string;
  newLabel: string;
  emptyText: string;
  columns: Column<T>[];
  /** Name of an item in the delete confirmation. */
  itemLabel: (item: T) => string;
};

// The list screen shared by events, clubs and partners: table with a published badge,
// publish toggle, edit link and delete with confirmation.
export function ResourceList<T extends { id: string; published: boolean }>({
  title,
  endpoint,
  basePath,
  newLabel,
  emptyText,
  columns,
  itemLabel,
}: ResourceListProps<T>) {
  const result = useApi<T[]>(endpoint, { admin: true });
  // The form pages send "Événement enregistré." along when they come back to the list.
  const { state } = useLocation() as { state: { notice?: string } | null };
  const [notice, setNotice] = useState(state?.notice);
  const [busyId, setBusyId] = useState<string>();
  const [actionError, setActionError] = useState<string>();
  const [pendingDelete, setPendingDelete] = useState<T>();
  const [deleting, setDeleting] = useState(false);

  async function togglePublished(item: T) {
    setNotice(undefined);
    setActionError(undefined);
    setBusyId(item.id);
    try {
      await apiRequest(`${endpoint}/${item.id}`, {
        method: 'PATCH',
        body: { published: !item.published },
        credentials: true,
      });
      setNotice('Modification enregistrée.');
      result.reload();
    } catch (error) {
      setActionError(errorMessage(error));
    } finally {
      setBusyId(undefined);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setNotice(undefined);
    setActionError(undefined);
    setDeleting(true);
    try {
      await apiRequest(`${endpoint}/${pendingDelete.id}`, { method: 'DELETE', credentials: true });
      setNotice('Élément supprimé.');
      result.reload();
    } catch (error) {
      setActionError(errorMessage(error));
    } finally {
      setDeleting(false);
      setPendingDelete(undefined);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title={title}
        action={<Button to={`${basePath}/nouveau`}>{newLabel}</Button>}
      />

      {notice && (
        <Alert tone="success" className="mb-6">
          {notice}
        </Alert>
      )}
      {actionError && (
        <Alert tone="error" className="mb-6">
          {actionError}
        </Alert>
      )}

      <DataView result={result} isEmpty={(items) => items.length === 0} empty={emptyText}>
        {(items) => (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full min-w-176 border-collapse text-left">
                <thead>
                  <tr className="text-wave-blue border-wave-blue border-b-4 text-xl">
                    {columns.map((column) => (
                      <th key={column.header} scope="col" className="px-4 py-3 font-normal">
                        {column.header}
                      </th>
                    ))}
                    <th scope="col" className="px-4 py-3 font-normal">
                      Statut
                    </th>
                    <th scope="col" className="px-4 py-3 font-normal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-wave-blue/30 border-b-2 align-middle last:border-b-0"
                    >
                      {columns.map((column) => (
                        <td key={column.header} className="px-4 py-3">
                          {column.cell(item)}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <PublishedBadge published={item.published} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" to={`${basePath}/${item.id}`}>
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            disabled={busyId === item.id}
                            onClick={() => void togglePublished(item)}
                          >
                            {item.published ? 'Dépublier' : 'Publier'}
                          </Button>
                          <Button size="sm" onClick={() => setPendingDelete(item)}>
                            Supprimer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </DataView>

      {pendingDelete && (
        <ConfirmDialog
          title="Supprimer cet élément ?"
          confirmLabel="Supprimer"
          busy={deleting}
          onConfirm={() => void confirmDelete()}
          onCancel={() => setPendingDelete(undefined)}
        >
          <p>
            « {itemLabel(pendingDelete)} » sera supprimé définitivement. Cette action est
            irréversible.
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}
