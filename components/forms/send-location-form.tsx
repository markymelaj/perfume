'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/shared/form-message';

export function SendLocationForm() {
  const [note, setNote] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendLocation() {
    if (!navigator.geolocation) {
      setMessage('Este dispositivo no soporta geolocalización.');
      return;
    }

    setLoading(true);
    setMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const response = await fetch('/api/location', {
          method: 'POST',
          body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            note: note || null
          })
        });

        const data = await response.json();
        setLoading(false);
        setMessage(data.message ?? (response.ok ? 'Ubicación enviada.' : 'No se pudo enviar.'));
        if (response.ok) {
          setNote('');
        }
      },
      () => {
        setLoading(false);
        setMessage('No fue posible obtener la ubicación.');
      }
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar ubicación</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <Label>Nota opcional</Label>
          <Input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Punto de venta actual" />
        </div>
        <Button onClick={sendLocation} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar ubicación actual'}
        </Button>
        <FormMessage message={message} />
      </CardContent>
    </Card>
  );
}
