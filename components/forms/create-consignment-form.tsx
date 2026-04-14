'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { FormMessage } from '@/components/shared/form-message';

export function CreateConsignmentForm({
  sellers,
  suppliers,
  products
}: {
  sellers: Array<{ id: string; display_name: string | null; email: string | null }>;
  suppliers: Array<{ id: string; name: string }>;
  products: Array<{ id: string; name: string; default_sale_price: number }>;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/consignments', {
      method: 'POST',
      body: JSON.stringify({
        seller_id: formData.get('seller_id'),
        supplier_id: formData.get('supplier_id') || null,
        product_id: formData.get('product_id'),
        quantity: formData.get('quantity'),
        unit_sale_price: formData.get('unit_sale_price'),
        notes: formData.get('notes') || null
      })
    });
    const data = await response.json();
    setMessage(data.message ?? (response.ok ? 'Consignación creada.' : 'No se pudo crear.'));
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva consignación</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div>
            <Label>Vendedor</Label>
            <Select name="seller_id" required defaultValue="">
              <option value="" disabled>Selecciona vendedor</option>
              {sellers.map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {seller.display_name ?? seller.email}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Proveedor</Label>
            <Select name="supplier_id" defaultValue="">
              <option value="">Sin proveedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Producto</Label>
            <Select name="product_id" required defaultValue="">
              <option value="" disabled>Selecciona producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Cantidad</Label>
              <Input name="quantity" type="number" min="1" required />
            </div>
            <div>
              <Label>Precio unitario</Label>
              <Input name="unit_sale_price" type="number" min="0" required />
            </div>
          </div>
          <div>
            <Label>Notas</Label>
            <Input name="notes" />
          </div>
          <Button>Abrir consignación</Button>
          <FormMessage message={message} />
        </form>
      </CardContent>
    </Card>
  );
}
