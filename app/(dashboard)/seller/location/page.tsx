import { requireSeller } from '@/lib/auth/guards';
import { SendLocationForm } from '@/components/forms/send-location-form';
import { DataTable } from '@/components/shared/data-table';
import { formatDate } from '@/lib/utils';
import type { LocationPing } from '@/lib/types';

export default async function SellerLocationPage() {
  const { supabase, profile } = await requireSeller();
  const { data: locations } = await supabase
    .from('location_pings')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <SendLocationForm />
      <DataTable
        title="Últimas ubicaciones"
        headers={['Latitud', 'Longitud', 'Nota', 'Fecha']}
        rows={((locations as LocationPing[]) ?? []).map((location) => (
          <tr key={location.id}>
            <td>{location.latitude}</td>
            <td>{location.longitude}</td>
            <td>{location.note ?? '—'}</td>
            <td>{formatDate(location.created_at)}</td>
          </tr>
        ))}
      />
    </div>
  );
}
