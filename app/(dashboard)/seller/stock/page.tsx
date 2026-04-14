import { requireSeller } from '@/lib/auth/guards';
import { DataTable } from '@/components/shared/data-table';
import { buildRemainingMap } from '@/lib/server-data';
import { formatCurrency } from '@/lib/utils';
import type { ConsignmentItem, Product, SaleItem, ReconciliationItem } from '@/lib/types';

export default async function SellerStockPage() {
  const { supabase, profile } = await requireSeller();

  const [{ data: items }, { data: products }, { data: salesItems }, { data: reconciliationItems }] = await Promise.all([
    supabase.from('consignment_items').select('*, consignments!inner(seller_id, status)').eq('consignments.seller_id', profile.id),
    supabase.from('products').select('*'),
    supabase.from('sales_items').select('*, sales!inner(seller_id)').eq('sales.seller_id', profile.id),
    supabase.from('reconciliation_items').select('*, reconciliations!inner(seller_id)').eq('reconciliations.seller_id', profile.id)
  ]);

  const productMap = new Map(((products as Product[]) ?? []).map((item) => [item.id, item.name]));
  const remainingMap = buildRemainingMap({
    consignmentItems: (items as unknown as ConsignmentItem[]) ?? [],
    salesItems: (salesItems as unknown as SaleItem[]) ?? [],
    reconciliationItems: (reconciliationItems as unknown as ReconciliationItem[]) ?? []
  });

  return (
    <DataTable
      title="Mi stock asignado"
      headers={['Producto', 'Asignado', 'Disponible', 'Precio']}
      rows={((items as unknown as ConsignmentItem[]) ?? []).map((item) => (
        <tr key={item.id}>
          <td>{productMap.get(item.product_id) ?? item.product_id}</td>
          <td>{item.quantity_assigned}</td>
          <td>{remainingMap.get(item.id) ?? item.quantity_assigned}</td>
          <td>{formatCurrency(item.unit_sale_price)}</td>
        </tr>
      ))}
    />
  );
}
