import { NextResponse } from 'next/server';
import { consignmentSchema } from '@/lib/validators';
import { getCurrentProfile, jsonError } from '@/app/api/_helpers';

export async function POST(request: Request) {
  const { supabase, profile } = await getCurrentProfile();
  if (!profile || profile.role !== 'owner') {
    return jsonError('No autorizado', 403);
  }

  const body = consignmentSchema.safeParse(await request.json());
  if (!body.success) {
    return jsonError('Datos inválidos');
  }

  const { data: consignment, error: consignmentError } = await supabase
    .from('consignments')
    .insert({
      seller_id: body.data.seller_id,
      supplier_id: body.data.supplier_id ?? null,
      opened_by: profile.id,
      notes: body.data.notes ?? null
    })
    .select('*')
    .single();

  if (consignmentError || !consignment) {
    return jsonError(consignmentError?.message ?? 'No se pudo crear la consignación.');
  }

  const { error: itemError } = await supabase.from('consignment_items').insert({
    consignment_id: consignment.id,
    product_id: body.data.product_id,
    quantity_assigned: body.data.quantity,
    unit_sale_price: body.data.unit_sale_price
  });

  if (itemError) {
    await supabase.from('consignments').delete().eq('id', consignment.id);
    return jsonError(itemError.message);
  }

  return NextResponse.json({ message: 'Consignación creada.' });
}
