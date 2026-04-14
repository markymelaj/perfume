'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function ToggleUserStatusButton({ userId, isActive }: { userId: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleStatus() {
    setLoading(true);
    const response = await fetch('/api/admin/toggle-user-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isActive: !isActive })
    });
    setLoading(false);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      window.alert(data.message ?? 'No se pudo actualizar el estado.');
      return;
    }

    router.refresh();
  }

  return (
    <Button variant={isActive ? 'danger' : 'secondary'} onClick={toggleStatus} disabled={loading}>
      {loading ? 'Actualizando...' : isActive ? 'Desactivar' : 'Activar'}
    </Button>
  );
}
