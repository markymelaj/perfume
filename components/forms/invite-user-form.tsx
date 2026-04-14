'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/shared/form-message';

export function InviteUserForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);

    const response = await fetch('/api/admin/invite-user', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email'),
        displayName: formData.get('displayName'),
        phone: formData.get('phone')
      })
    });

    const data = await response.json();
    setLoading(false);
    setMessage(data.message ?? (response.ok ? 'Usuario invitado.' : 'No se pudo invitar.'));
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear vendedor</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div>
            <Label>Nombre</Label>
            <Input name="displayName" placeholder="Camila Soto" required />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" placeholder="camila@dominio.com" required />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input name="phone" placeholder="+56 9 ..." />
          </div>
          <Button disabled={loading}>{loading ? 'Enviando...' : 'Invitar vendedor'}</Button>
          <FormMessage message={message} />
        </form>
      </CardContent>
    </Card>
  );
}
