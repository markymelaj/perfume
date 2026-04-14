import { NextResponse } from 'next/server';
import { saleSchema } from '@/lib/validators';
import { getCurrentProfile, jsonError } from '@/app/api/_helpers';

export async function POST(request: Request) {
  const { supabase, profile } = await getCurrentProfile();
  if (!profile) {
    return jsonError('No autorizado', 403);
  }

  const body = saleSchema.safeParse(await request.json());
  if (!body.success) {
    return jsonError('Datos inválidos');
  }

  const { data: consignmentItem, error: itemLookupError } = await supabase
    .from('consignment_items')
    .select('*')
    .eq('id', body.data.consignment_item_id)
    .single();

  if (itemLookupError || !consignmentItem) {
    return jsonError('Item de consignación no encontrado.');
  }

  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .insert({
      consignment_id: consignmentItem.consignment_id,
      payment_method: body.data.payment_method,
      notes: body.data.notes ?? null,
      created_by: profile.id
    })
    .select('*')
    .single();

  if (saleError || !sale) {
    return jsonError(saleError?.message ?? 'No se pudo crear la venta.');
  }

  const { error: saleItemError } = await supabase.from('sales_items').insert({
    sale_id: sale.id,
    consignment_item_id: body.data.consignment_item_id,
    quantity: body.data.quantity,
    unit_sale_price: consignmentItem.unit_sale_price
  });

  if (saleItemError) {
    await supabase.from('sales').delete().eq('id', sale.id);
    return jsonError(saleItemError.message);
  }

  return NextResponse.json({ message: 'Venta registrada.' });
}
