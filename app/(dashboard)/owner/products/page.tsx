import { requireOwner } from '@/lib/auth/guards';
import { CreateSupplierForm } from '@/components/forms/create-supplier-form';
import { CreateProductForm } from '@/components/forms/create-product-form';
import { DataTable } from '@/components/shared/data-table';
import { formatCurrency } from '@/lib/utils';
import type { Product, Supplier } from '@/lib/types';

export default async function OwnerProductsPage() {
  const { supabase } = await requireOwner();

  const [{ data: suppliers }, { data: products }] = await Promise.all([
    supabase.from('suppliers').select('*').order('created_at', { ascending: false }),
    supabase.from('products').select('*').order('created_at', { ascending: false })
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <CreateSupplierForm />
        <CreateProductForm
          suppliers={((suppliers as Supplier[]) ?? []).map((supplier) => ({
            id: supplier.id,
            name: supplier.name
          }))}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataTable
          title="Proveedores"
          headers={['Nombre', 'Contacto', 'Teléfono']}
          rows={((suppliers as Supplier[]) ?? []).map((supplier) => (
            <tr key={supplier.id}>
              <td>{supplier.name}</td>
              <td>{supplier.contact_name ?? '—'}</td>
              <td>{supplier.contact_phone ?? '—'}</td>
            </tr>
          ))}
        />

        <DataTable
          title="Productos"
          headers={['Nombre', 'SKU', 'Precio por defecto']}
          rows={((products as Product[]) ?? []).map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.sku ?? '—'}</td>
              <td>{formatCurrency(product.default_sale_price)}</td>
            </tr>
          ))}
        />
      </div>
    </div>
  );
}
