'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/shared/form-message';

export function CreateSupplierForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/suppliers', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.get('name'),
        contact_name: formData.get('contact_name'),
        contact_phone: formData.get('contact_phone'),
        notes: formData.get('notes')
      })
    });
    const data = await response.json();
    setMessage(data.message ?? (response.ok ? 'Proveedor creado.' : 'No se pudo crear.'));
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo proveedor</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div>
            <Label>Nombre</Label>
            <Input name="name" required />
          </div>
          <div>
            <Label>Contacto</Label>
            <Input name="contact_name" />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input name="contact_phone" />
          </div>
          <div>
            <Label>Notas</Label>
            <Input name="notes" />
          </div>
          <Button>Guardar proveedor</Button>
          <FormMessage message={message} />
        </form>
      </CardContent>
    </Card>
  );
}
