import { requireOwner } from '@/lib/auth/guards';
import { CreateConsignmentForm } from '@/components/forms/create-consignment-form';
import { DataTable } from '@/components/shared/data-table';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Consignment, ConsignmentItem, Product, Profile, Supplier } from '@/lib/types';

export default async function OwnerConsignmentsPage() {
  const { supabase } = await requireOwner();

  const [{ data: sellers }, { data: suppliers }, { data: products }, { data: consignments }, { data: items }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'seller').eq('is_active', true),
      supabase.from('suppliers').select('*').eq('is_active', true),
      supabase.from('products').select('*').eq('is_active', true),
      supabase.from('consignments').select('*').order('opened_at', { ascending: false }),
      supabase.from('consignment_items').select('*')
    ]);

  const productMap = new Map(((products as Product[]) ?? []).map((item) => [item.id, item.name]));
  const sellerMap = new Map(((sellers as Profile[]) ?? []).map((item) => [item.id, item.display_name ?? item.email ?? item.id]));
  const itemMap = new Map<string, ConsignmentItem[]>();
  for (const item of (items as ConsignmentItem[]) ?? []) {
    itemMap.set(item.consignment_id, [...(itemMap.get(item.consignment_id) ?? []), item]);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <CreateConsignmentForm
        sellers={(sellers as Profile[]) ?? []}
        suppliers={(suppliers as Supplier[]) ?? []}
        products={(products as Product[]) ?? []}
      />
      <DataTable
        title="Consignaciones"
        headers={['Vendedor', 'Estado', 'Detalle', 'Apertura']}
        rows={((consignments as Consignment[]) ?? []).map((consignment) => (
          <tr key={consignment.id}>
            <td>{sellerMap.get(consignment.seller_id) ?? consignment.seller_id}</td>
            <td>{consignment.status}</td>
            <td className="space-y-1">
              {(itemMap.get(consignment.id) ?? []).map((item) => (
                <div key={item.id}>
                  {productMap.get(item.product_id) ?? item.product_id} · {item.quantity_assigned} un. · {formatCurrency(item.unit_sale_price)}
                </div>
              ))}
            </td>
            <td>{formatDate(consignment.opened_at)}</td>
          </tr>
        ))}
      />
    </div>
  );
}
