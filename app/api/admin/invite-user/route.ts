import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { inviteUserSchema } from '@/lib/validators';
import { getCurrentProfile, jsonError } from '@/app/api/_helpers';

export async function POST(request: Request) {
  const { profile } = await getCurrentProfile();
  if (!profile || (profile.role !== 'owner' && profile.role !== 'super_admin')) {
    return jsonError('No autorizado', 403);
  }

  const body = inviteUserSchema.safeParse(await request.json());
  if (!body.success) {
    return jsonError(body.error.issues[0]?.message ?? 'Datos inválidos');
  }

  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email: body.data.email,
    password: body.data.password,
    email_confirm: true,
    user_metadata: {
      display_name: body.data.displayName
    }
  });

  if (error) {
    return jsonError(error.message);
  }

  if (!data.user) {
    return jsonError('No se pudo crear el usuario.');
  }

  const { error: profileError } = await admin
    .from('profiles')
    .update({
      display_name: body.data.displayName,
      phone: body.data.phone ?? null,
      role: 'seller',
      is_active: true,
      must_reenroll_security: true
    })
    .eq('id', data.user.id);

  if (profileError) {
    return jsonError(profileError.message);
  }

  return NextResponse.json({ message: 'Vendedor creado correctamente con contraseña temporal.' });
}
