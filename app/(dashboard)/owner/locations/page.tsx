import { requireOwner } from '@/lib/auth/guards';
import { DataTable } from '@/components/shared/data-table';
import { formatDate } from '@/lib/utils';
import type { LocationPing, Profile } from '@/lib/types';

export default async function OwnerLocationsPage() {
  const { supabase } = await requireOwner();

  const [{ data: locations }, { data: sellers }] = await Promise.all([
    supabase.from('location_pings').select('*').order('created_at', { ascending: false }).limit(100),
    supabase.from('profiles').select('*').eq('role', 'seller')
  ]);

  const sellerMap = new Map(((sellers as Profile[]) ?? []).map((item) => [item.id, item.display_name ?? item.email ?? item.id]));

  return (
    <DataTable
      title="Ubicaciones reportadas"
      headers={['Vendedor', 'Latitud', 'Longitud', 'Nota', 'Fecha']}
      rows={((locations as LocationPing[]) ?? []).map((location) => (
        <tr key={location.id}>
          <td>{sellerMap.get(location.user_id) ?? location.user_id}</td>
          <td>{location.latitude}</td>
          <td>{location.longitude}</td>
          <td>{location.note ?? '—'}</td>
          <td>{formatDate(location.created_at)}</td>
        </tr>
      ))}
    />
  );
}
