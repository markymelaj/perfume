'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function ResetAccessButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function resetAccess() {
    const password = window.prompt('Nueva contraseña temporal (mínimo 8 caracteres):');
    if (!password) return;

    setLoading(true);
    const response = await fetch('/api/admin/reset-user-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password })
    });
    setLoading(false);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      window.alert(data.message ?? 'No se pudo reiniciar el acceso.');
      return;
    }

    window.alert(`Acceso reiniciado. Contraseña temporal: ${password}`);
    router.refresh();
  }

  return (
    <Button variant="secondary" onClick={resetAccess} disabled={loading}>
      {loading ? 'Actualizando...' : 'Reset password'}
    </Button>
  );
}
