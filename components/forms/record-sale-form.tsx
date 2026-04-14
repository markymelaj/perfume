'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { FormMessage } from '@/components/shared/form-message';

export function RecordSaleForm({
  items
}: {
  items: Array<{
    id: string;
    product_name: string;
    remaining: number;
    unit_sale_price: number;
  }>;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);

    const response = await fetch('/api/sales', {
      method: 'POST',
      body: JSON.stringify({
        consignment_item_id: formData.get('consignment_item_id'),
        quantity: formData.get('quantity'),
        payment_method: formData.get('payment_method'),
        notes: formData.get('notes') || null
      })
    });

    const data = await response.json();
    setMessage(data.message ?? (response.ok ? 'Venta registrada.' : 'No se pudo registrar.'));
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar venta</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div>
            <Label>Producto asignado</Label>
            <Select name="consignment_item_id" required defaultValue="">
              <option value="" disabled>Selecciona producto</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.product_name} · Disponible: {item.remaining} · {item.unit_sale_price}
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
              <Label>Pago</Label>
              <Select name="payment_method" defaultValue="cash">
                <option value="cash">Efectivo</option>
                <option value="transfer">Transferencia</option>
                <option value="mixed">Mixto</option>
              </Select>
            </div>
          </div>
          <div>
            <Label>Notas</Label>
            <Input name="notes" />
          </div>
          <Button>Guardar venta</Button>
          <FormMessage message={message} />
        </form>
      </CardContent>
    </Card>
  );
}
