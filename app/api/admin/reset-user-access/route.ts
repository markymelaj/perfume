import { NextResponse } from 'next/server';
import { resetAccessSchema } from '@/lib/validators';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentProfile, jsonError } from '@/app/api/_helpers';

export async function POST(request: Request) {
  const { profile } = await getCurrentProfile();
  if (!profile || profile.role !== 'owner') {
    return jsonError('No autorizado', 403);
  }

  const body = resetAccessSchema.safeParse(await request.json());
  if (!body.success) {
    return jsonError('Datos inválidos');
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('profiles')
    .update({ must_reenroll_security: true })
    .eq('id', body.data.userId);

  if (error) {
    return jsonError(error.message);
  }

  return NextResponse.json({ message: 'Acceso marcado para reinicio.' });
}
