import { requireSeller } from '@/lib/auth/guards';
import { RecordSaleForm } from '@/components/forms/record-sale-form';
import { DataTable } from '@/components/shared/data-table';
import { buildRemainingMap } from '@/lib/server-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { ConsignmentItem, Product, Sale, SaleItem, ReconciliationItem } from '@/lib/types';

export default async function SellerSalesPage() {
  const { supabase, profile } = await requireSeller();

  const [{ data: items }, { data: products }, { data: sales }, { data: salesItems }, { data: reconciliationItems }] =
    await Promise.all([
      supabase.from('consignment_items').select('*, consignments!inner(seller_id, status)').eq('consignments.seller_id', profile.id),
      supabase.from('products').select('*'),
      supabase.from('sales').select('*').eq('seller_id', profile.id).order('sold_at', { ascending: false }).limit(50),
      supabase.from('sales_items').select('*, sales!inner(seller_id)').eq('sales.seller_id', profile.id),
      supabase.from('reconciliation_items').select('*, reconciliations!inner(seller_id)').eq('reconciliations.seller_id', profile.id)
    ]);

  const productMap = new Map(((products as Product[]) ?? []).map((item) => [item.id, item.name]));
  const saleItemsList = (salesItems as unknown as SaleItem[]) ?? [];
  const remainingMap = buildRemainingMap({
    consignmentItems: (items as unknown as ConsignmentItem[]) ?? [],
    salesItems: saleItemsList,
    reconciliationItems: (reconciliationItems as unknown as ReconciliationItem[]) ?? []
  });

  const saleTotals = new Map<string, number>();
  for (const item of saleItemsList) {
    saleTotals.set(item.sale_id, (saleTotals.get(item.sale_id) ?? 0) + item.quantity * item.unit_sale_price);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <RecordSaleForm
        items={((items as unknown as ConsignmentItem[]) ?? []).map((item) => ({
          id: item.id,
          product_name: productMap.get(item.product_id) ?? item.product_id,
          remaining: remainingMap.get(item.id) ?? item.quantity_assigned,
          unit_sale_price: item.unit_sale_price
        }))}
      />
      <DataTable
        title="Ventas recientes"
        headers={['Fecha', 'Pago', 'Monto', 'Notas']}
        rows={((sales as Sale[]) ?? []).map((sale) => (
          <tr key={sale.id}>
            <td>{formatDate(sale.sold_at)}</td>
            <td>{sale.payment_method}</td>
            <td>{formatCurrency(saleTotals.get(sale.id) ?? 0)}</td>
            <td>{sale.notes ?? '—'}</td>
          </tr>
        ))}
      />
    </div>
  );
}
