import { requireSeller } from '@/lib/auth/guards';
import { KpiCard } from '@/components/shared/kpi-card';
import { buildCashSummary, buildRemainingMap } from '@/lib/server-data';
import type { Consignment, ConsignmentItem, Sale, SaleItem, Reconciliation, ReconciliationItem } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export default async function SellerDashboardPage() {
  const { supabase, profile } = await requireSeller();

  const [{ data: consignments }, { data: consignmentItems }, { data: sales }, { data: salesItems }, { data: reconciliations }, { data: reconciliationItems }] =
    await Promise.all([
      supabase.from('consignments').select('*').eq('seller_id', profile.id),
      supabase.from('consignment_items').select('*, consignments!inner(seller_id)').eq('consignments.seller_id', profile.id),
      supabase.from('sales').select('*').eq('seller_id', profile.id),
      supabase.from('sales_items').select('*, sales!inner(seller_id)').eq('sales.seller_id', profile.id),
      supabase.from('reconciliations').select('*').eq('seller_id', profile.id),
      supabase.from('reconciliation_items').select('*, reconciliations!inner(seller_id)').eq('reconciliations.seller_id', profile.id)
    ]);

  const remainingMap = buildRemainingMap({
    consignmentItems: (consignmentItems as unknown as ConsignmentItem[]) ?? [],
    salesItems: (salesItems as unknown as SaleItem[]) ?? [],
    reconciliationItems: (reconciliationItems as unknown as ReconciliationItem[]) ?? []
  });

  const summary = buildCashSummary({
    sales: (sales as Sale[]) ?? [],
    salesItems: (salesItems as unknown as SaleItem[]) ?? [],
    reconciliations: (reconciliations as Reconciliation[]) ?? []
  });

  const totalRemainingUnits = Array.from(remainingMap.values()).reduce((acc, value) => acc + value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-white">Resumen del vendedor</h2>
        <p className="mt-1 text-zinc-400">
          Control personal de stock, ventas, caja, mensajes y ubicación operativa.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="Consignaciones" value={String(((consignments as Consignment[]) ?? []).length)} />
        <KpiCard label="Unidades disponibles" value={String(totalRemainingUnits)} />
        <KpiCard label="Pendiente por rendir" value={formatCurrency(summary.pendiente)} />
      </div>
    </div>
  );
}
