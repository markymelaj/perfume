'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { FormMessage } from '@/components/shared/form-message';

export function CreateReconciliationForm({
  consignments,
  consignmentItems
}: {
  consignments: Array<{ id: string; seller_name: string; status: string }>;
  consignmentItems: Array<{ id: string; consignment_id: string; product_name: string }>;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const quantityReturned = Number(formData.get('quantity_returned') || 0);
    const consignmentItemId = String(formData.get('consignment_item_id') || '');

    const response = await fetch('/api/reconciliations', {
      method: 'POST',
      body: JSON.stringify({
        consignment_id: formData.get('consignment_id'),
        type: formData.get('type'),
        cash_received: formData.get('cash_received'),
        transfer_received: formData.get('transfer_received'),
        notes: formData.get('notes') || null,
        returns:
          consignmentItemId && quantityReturned > 0
            ? [{ consignment_item_id: consignmentItemId, quantity_returned: quantityReturned }]
            : []
      })
    });

    const data = await response.json();
    setMessage(data.message ?? (response.ok ? 'Rendición registrada.' : 'No se pudo registrar.'));
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva rendición</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div>
            <Label>Consignación</Label>
            <Select name="consignment_id" required defaultValue="">
              <option value="" disabled>Selecciona consignación</option>
              {consignments.map((consignment) => (
                <option key={consignment.id} value={consignment.id}>
                  {consignment.seller_name} · {consignment.status}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Tipo</Label>
            <Select name="type" defaultValue="partial">
              <option value="partial">Parcial</option>
              <option value="total">Total</option>
            </Select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Efectivo recibido</Label>
              <Input name="cash_received" type="number" min="0" defaultValue="0" />
            </div>
            <div>
              <Label>Transferencias</Label>
              <Input name="transfer_received" type="number" min="0" defaultValue="0" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Item devuelto</Label>
              <Select name="consignment_item_id" defaultValue="">
                <option value="">Sin devolución</option>
                {consignmentItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.product_name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Cantidad devuelta</Label>
              <Input name="quantity_returned" type="number" min="0" defaultValue="0" />
            </div>
          </div>
          <div>
            <Label>Notas</Label>
            <Input name="notes" />
          </div>
          <Button>Registrar rendición</Button>
          <FormMessage message={message} />
        </form>
      </CardContent>
    </Card>
  );
}
