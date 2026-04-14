'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function ResetAccessButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function resetAccess() {
    setLoading(true);
    const response = await fetch('/api/admin/reset-user-access', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
    setLoading(false);

    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <Button variant="secondary" onClick={resetAccess} disabled={loading}>
      {loading ? 'Actualizando...' : 'Reiniciar acceso'}
    </Button>
  );
}
