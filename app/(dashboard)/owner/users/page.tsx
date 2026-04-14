import { requireOwner } from '@/lib/auth/guards';
import { InviteUserForm } from '@/components/forms/invite-user-form';
import { ResetAccessButton } from '@/components/forms/reset-access-button';
import { DataTable } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import type { Profile } from '@/lib/types';

export default async function OwnerUsersPage() {
  const { supabase } = await requireOwner();
  const { data: sellers } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'seller')
    .order('created_at', { ascending: false });

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <InviteUserForm />
      <DataTable
        title="Vendedores"
        headers={['Nombre', 'Email', 'Estado', 'Seguridad', 'Acciones']}
        rows={((sellers as Profile[]) ?? []).map((seller) => (
          <tr key={seller.id}>
            <td>{seller.display_name ?? '—'}</td>
            <td>{seller.email ?? '—'}</td>
            <td>{seller.is_active ? <Badge variant="success">Activo</Badge> : <Badge>Inactivo</Badge>}</td>
            <td>
              {seller.must_reenroll_security ? <Badge variant="warning">Pendiente</Badge> : <Badge variant="success">Ok</Badge>}
            </td>
            <td>
              <ResetAccessButton userId={seller.id} />
            </td>
          </tr>
        ))}
      />
    </div>
  );
}
