'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function LoginForm({ error }: { error?: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`
      }
    });

    setLoading(false);
    setMessage(error ? error.message : 'Te enviamos un enlace de acceso.');
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Consigna Privada</CardTitle>
        <p className="mt-2 text-sm text-zinc-400">
          Acceso interno para dueños y vendedores autorizados.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="tu@dominio.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <Button disabled={loading}>{loading ? 'Enviando...' : 'Enviar acceso'}</Button>
          {message ? <p className="text-sm text-zinc-400">{message}</p> : null}
          {error === 'inactive' ? (
            <p className="text-sm text-amber-300">Tu usuario no está activo. Pide al dueño que lo habilite.</p>
          ) : null}
          {error === 'auth' ? (
            <p className="text-sm text-rose-300">El enlace de acceso es inválido o venció. Solicita uno nuevo.</p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
