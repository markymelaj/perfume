import { NextResponse } from 'next/server';
import { locationSchema } from '@/lib/validators';
import { getCurrentProfile, jsonError } from '@/app/api/_helpers';

export async function POST(request: Request) {
  const { supabase, profile } = await getCurrentProfile();
  if (!profile) {
    return jsonError('No autorizado', 403);
  }

  const body = locationSchema.safeParse(await request.json());
  if (!body.success) {
    return jsonError('Datos inválidos');
  }

  const { error } = await supabase.from('location_pings').insert({
    user_id: profile.id,
    latitude: body.data.latitude,
    longitude: body.data.longitude,
    note: body.data.note ?? null
  });

  if (error) {
    return jsonError(error.message);
  }

  return NextResponse.json({ message: 'Ubicación enviada.' });
}
