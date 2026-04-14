'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { FormMessage } from '@/components/shared/form-message';

export function CreateProductForm({
  suppliers
}: {
  suppliers: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify({
        supplier_id: formData.get('supplier_id') || null,
        sku: formData.get('sku') || null,
        name: formData.get('name'),
        description: formData.get('description') || null,
        default_sale_price: formData.get('default_sale_price')
      })
    });
    const data = await response.json();
    setMessage(data.message ?? (response.ok ? 'Producto creado.' : 'No se pudo crear.'));
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo producto</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
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
            <Label>SKU</Label>
            <Input name="sku" />
          </div>
          <div>
            <Label>Nombre</Label>
            <Input name="name" required />
          </div>
          <div>
            <Label>Descripción</Label>
            <Input name="description" />
          </div>
          <div>
            <Label>Precio por defecto</Label>
            <Input name="default_sale_price" type="number" min="0" step="1" required />
          </div>
          <Button>Guardar producto</Button>
          <FormMessage message={message} />
        </form>
      </CardContent>
    </Card>
  );
}
