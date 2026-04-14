import { NextResponse } from 'next/server';
import { resetAccessSchema } from '@/lib/validators';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentProfile, jsonError } from '@/app/api/_helpers';

export async function POST(request: Request) {
  const { profile } = await getCurrentProfile();
  if (!profile || (profile.role !== 'owner' && profile.role !== 'super_admin')) {
    return jsonError('No autorizado', 403);
  }

  const body = resetAccessSchema.safeParse(await request.json());
  if (!body.success) {
    return jsonError(body.error.issues[0]?.message ?? 'Datos inválidos');
  }

  const admin = createAdminClient();

  const { error: authError } = await admin.auth.admin.updateUserById(body.data.userId, {
    password: body.data.password,
    user_metadata: {
      password_reset_at: new Date().toISOString()
    }
  });

  if (authError) {
    return jsonError(authError.message);
  }

  const { error: profileError } = await admin
    .from('profiles')
    .update({ must_reenroll_security: true })
    .eq('id', body.data.userId);

  if (profileError) {
    return jsonError(profileError.message);
  }

  return NextResponse.json({ message: 'Contraseña temporal actualizada correctamente.' });
}
