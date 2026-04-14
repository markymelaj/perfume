import { requireOwner } from '@/lib/auth/guards';
import { CreateReconciliationForm } from '@/components/forms/create-reconciliation-form';
import { DataTable } from '@/components/shared/data-table';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Consignment, ConsignmentItem, Product, Profile, Reconciliation } from '@/lib/types';

export default async function OwnerReconciliationsPage() {
  const { supabase } = await requireOwner();

  const [{ data: consignments }, { data: items }, { data: products }, { data: sellers }, { data: reconciliations }] =
    await Promise.all([
      supabase.from('consignments').select('*').order('opened_at', { ascending: false }),
      supabase.from('consignment_items').select('*'),
      supabase.from('products').select('*'),
      supabase.from('profiles').select('*').eq('role', 'seller'),
      supabase.from('reconciliations').select('*').order('created_at', { ascending: false })
    ]);

  const sellerMap = new Map(((sellers as Profile[]) ?? []).map((item) => [item.id, item.display_name ?? item.email ?? item.id]));
  const productMap = new Map(((products as Product[]) ?? []).map((item) => [item.id, item.name]));
  const itemList = ((items as ConsignmentItem[]) ?? []).map((item) => ({
    id: item.id,
    consignment_id: item.consignment_id,
    product_name: productMap.get(item.product_id) ?? item.product_id
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <CreateReconciliationForm
        consignments={((consignments as Consignment[]) ?? []).map((item) => ({
          id: item.id,
          seller_name: sellerMap.get(item.seller_id) ?? item.seller_id,
          status: item.status
        }))}
        consignmentItems={itemList}
      />
      <DataTable
        title="Rendiciones"
        headers={['Vendedor', 'Tipo', 'Monto', 'Fecha']}
        rows={((reconciliations as Reconciliation[]) ?? []).map((item) => (
          <tr key={item.id}>
            <td>{sellerMap.get(item.seller_id) ?? item.seller_id}</td>
            <td>{item.type}</td>
            <td>{formatCurrency(Number(item.cash_received) + Number(item.transfer_received))}</td>
            <td>{formatDate(item.created_at)}</td>
          </tr>
        ))}
      />
    </div>
  );
}
