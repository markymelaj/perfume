import { NextResponse } from 'next/server';
import { supplierSchema } from '@/lib/validators';
import { getCurrentProfile, jsonError } from '@/app/api/_helpers';

export async function POST(request: Request) {
  const { supabase, profile } = await getCurrentProfile();
  if (!profile || profile.role !== 'owner') {
    return jsonError('No autorizado', 403);
  }

  const body = supplierSchema.safeParse(await request.json());
  if (!body.success) {
    return jsonError('Datos inválidos');
  }

  const { error } = await supabase.from('suppliers').insert(body.data);

  if (error) {
    return jsonError(error.message);
  }

  return NextResponse.json({ message: 'Proveedor creado.' });
}
