import { NextResponse } from 'next/server';
import { toggleUserStatusSchema } from '@/lib/validators';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentProfile, jsonError } from '@/app/api/_helpers';

export async function POST(request: Request) {
  const { profile } = await getCurrentProfile();
  if (!profile || (profile.role !== 'owner' && profile.role !== 'super_admin')) {
    return jsonError('No autorizado', 403);
  }

  const body = toggleUserStatusSchema.safeParse(await request.json());
  if (!body.success) {
    return jsonError(body.error.issues[0]?.message ?? 'Datos inválidos');
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from('profiles')
    .update({ is_active: body.data.isActive })
    .eq('id', body.data.userId);

  if (error) {
    return jsonError(error.message);
  }

  return NextResponse.json({
    message: body.data.isActive ? 'Usuario activado.' : 'Usuario desactivado.'
  });
}
