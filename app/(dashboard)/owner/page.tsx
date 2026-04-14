import { requireOwner } from '@/lib/auth/guards';
import { KpiCard } from '@/components/shared/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Profile, Sale, SaleItem, Reconciliation } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { buildCashSummary } from '@/lib/server-data';

export default async function OwnerDashboardPage() {
  const { supabase } = await requireOwner();

  const [{ data: sellers }, { data: sales }, { data: salesItems }, { data: reconciliations }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'seller').order('created_at', { ascending: false }),
      supabase.from('sales').select('*').order('sold_at', { ascending: false }).limit(10),
      supabase.from('sales_items').select('*'),
      supabase.from('reconciliations').select('*').order('created_at', { ascending: false }).limit(10)
    ]);

  const summary = buildCashSummary({
    sales: (sales as Sale[]) ?? [],
    salesItems: (salesItems as SaleItem[]) ?? [],
    reconciliations: (reconciliations as Reconciliation[]) ?? []
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-white">Panel del dueño</h2>
        <p className="mt-1 text-zinc-400">
          Control centralizado de vendedores, stock, caja, rendiciones y mensajería interna.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="Vendedores activos" value={String(((sellers as Profile[]) ?? []).filter((item) => item.is_active).length)} />
        <KpiCard label="Total vendido" value={formatCurrency(summary.totalSold)} />
        <KpiCard label="Pendiente por rendir" value={formatCurrency(summary.pendiente)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Qué resuelve esta app</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-zinc-300">
          <p>• Alta controlada de vendedores y acceso privado invite-only.</p>
          <p>• Asignación de stock por consignación, con precio y cantidad definidos por el dueño.</p>
          <p>• Registro de ventas desde teléfono, con impacto directo en caja y saldo pendiente.</p>
          <p>• Rendiciones parciales o totales con devolución opcional de stock.</p>
          <p>• Ubicación puntual y mensajería interna solo entre vendedor y dueño.</p>
        </CardContent>
      </Card>
    </div>
  );
}
