import { requireOwner } from '@/lib/auth/guards';
import { DataTable } from '@/components/shared/data-table';
import { formatDate } from '@/lib/utils';

type AuditLog = {
  id: string;
  action: string;
  table_name: string;
  created_at: string;
  payload: unknown;
};

export default async function OwnerAuditPage() {
  const { supabase } = await requireOwner();
  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <DataTable
      title="Auditoría"
      headers={['Tabla', 'Acción', 'Fecha', 'Detalle']}
      rows={((logs as AuditLog[]) ?? []).map((log) => (
        <tr key={log.id}>
          <td>{log.table_name}</td>
          <td>{log.action}</td>
          <td>{formatDate(log.created_at)}</td>
          <td>
            <pre className="whitespace-pre-wrap text-xs text-zinc-400">
              {JSON.stringify(log.payload, null, 2)}
            </pre>
          </td>
        </tr>
      ))}
    />
  );
}
