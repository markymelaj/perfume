import { NextResponse } from 'next/server';
import { getCurrentProfile, jsonError } from '@/app/api/_helpers';
import { messageSchema } from '@/lib/validators';
import type { Profile } from '@/lib/types';

export async function POST(request: Request) {
  const { supabase, profile } = await getCurrentProfile();
  if (!profile) {
    return jsonError('No autorizado', 403);
  }

  const body = messageSchema.safeParse(await request.json());
  if (!body.success) {
    return jsonError('Datos inválidos');
  }

  let ownerId = profile.role === 'owner' ? profile.id : '';
  let sellerId = profile.role === 'seller' ? profile.id : body.data.seller_id ?? '';

  if (profile.role === 'seller') {
    const { data: owner } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'owner')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (!owner) {
      return jsonError('No se encontró un owner activo.');
    }

    ownerId = owner.id;
  }

  if (profile.role === 'owner' && !sellerId) {
    return jsonError('Debes indicar el vendedor.');
  }

  const { error } = await supabase.from('internal_messages').insert({
    owner_id: ownerId,
    seller_id: sellerId,
    sender_id: profile.id,
    body: body.data.body
  });

  if (error) {
    return jsonError(error.message);
  }

  return NextResponse.json({ message: 'Mensaje enviado.' });
}
