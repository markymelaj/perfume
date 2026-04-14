'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function LoginForm({ error }: { error?: string }) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      setMessage(error.message === 'Invalid login credentials'
        ? 'Credenciales inválidas.'
        : error.message);
      return;
    }

    router.replace('/');
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Consigna Privada</CardTitle>
        <p className="mt-2 text-sm text-zinc-400">
          Acceso interno para super usuarios, dueños y vendedores autorizados.
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
          <div>
            <Label>Contraseña</Label>
            <Input
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <Button disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</Button>
          {message ? <p className="text-sm text-zinc-400">{message}</p> : null}
          {error === 'inactive' ? (
            <p className="text-sm text-amber-300">Tu usuario no está activo. Pide al super usuario que lo habilite.</p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
