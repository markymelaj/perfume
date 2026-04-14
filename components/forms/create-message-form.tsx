'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormMessage } from '@/components/shared/form-message';

export function OwnerMessageForm({
  sellers
}: {
  sellers: Array<{ id: string; display_name: string | null; email: string | null }>;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);

    const response = await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        seller_id: formData.get('seller_id'),
        body: formData.get('body')
      })
    });

    const data = await response.json();
    setMessage(data.message ?? (response.ok ? 'Mensaje enviado.' : 'No se pudo enviar.'));
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo mensaje</CardTitle>
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
            <Label>Mensaje</Label>
            <Textarea name="body" required />
          </div>
          <Button>Enviar mensaje</Button>
          <FormMessage message={message} />
        </form>
      </CardContent>
    </Card>
  );
}

export function SellerMessageForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);

    const response = await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        body: formData.get('body')
      })
    });

    const data = await response.json();
    setMessage(data.message ?? (response.ok ? 'Mensaje enviado.' : 'No se pudo enviar.'));
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escribir al dueño</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div>
            <Label>Mensaje</Label>
            <Textarea name="body" required />
          </div>
          <Button>Enviar mensaje</Button>
          <FormMessage message={message} />
        </form>
      </CardContent>
    </Card>
  );
}
