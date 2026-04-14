import { NextResponse } from 'next/server';
import { productSchema } from '@/lib/validators';
import { getCurrentProfile, jsonError } from '@/app/api/_helpers';

export async function POST(request: Request) {
  const { supabase, profile } = await getCurrentProfile();
  if (!profile || profile.role !== 'owner') {
    return jsonError('No autorizado', 403);
  }

  const body = productSchema.safeParse(await request.json());
  if (!body.success) {
    return jsonError('Datos inválidos');
  }

  const payload = {
    ...body.data,
    supplier_id: body.data.supplier_id || null,
    sku: body.data.sku || null,
    description: body.data.description || null
  };

  const { error } = await supabase.from('products').insert(payload);

  if (error) {
    return jsonError(error.message);
  }

  return NextResponse.json({ message: 'Producto creado.' });
}
