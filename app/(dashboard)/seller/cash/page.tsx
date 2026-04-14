import { requireSeller } from '@/lib/auth/guards';
import { KpiCard } from '@/components/shared/kpi-card';
import { DataTable } from '@/components/shared/data-table';
import { buildCashSummary } from '@/lib/server-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Reconciliation, Sale, SaleItem } from '@/lib/types';

export default async function SellerCashPage() {
  const { supabase, profile } = await requireSeller();

  const [{ data: sales }, { data: salesItems }, { data: reconciliations }] = await Promise.all([
    supabase.from('sales').select('*').eq('seller_id', profile.id).order('sold_at', { ascending: false }),
    supabase.from('sales_items').select('*, sales!inner(seller_id)').eq('sales.seller_id', profile.id),
    supabase.from('reconciliations').select('*').eq('seller_id', profile.id).order('created_at', { ascending: false })
  ]);

  const summary = buildCashSummary({
    sales: (sales as Sale[]) ?? [],
    salesItems: (salesItems as unknown as SaleItem[]) ?? [],
    reconciliations: (reconciliations as Reconciliation[]) ?? []
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="Total vendido" value={formatCurrency(summary.totalSold)} />
        <KpiCard label="Total rendido" value={formatCurrency(summary.totalRendido)} />
        <KpiCard label="Pendiente" value={formatCurrency(summary.pendiente)} />
      </div>

      <DataTable
        title="Rendiciones registradas"
        headers={['Fecha', 'Tipo', 'Monto', 'Notas']}
        rows={((reconciliations as Reconciliation[]) ?? []).map((item) => (
          <tr key={item.id}>
            <td>{formatDate(item.created_at)}</td>
            <td>{item.type}</td>
            <td>{formatCurrency(Number(item.cash_received) + Number(item.transfer_received))}</td>
            <td>{item.notes ?? '—'}</td>
          </tr>
        ))}
      />
    </div>
  );
}
