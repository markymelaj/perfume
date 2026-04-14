import { NextResponse } from 'next/server';
import { reconciliationSchema } from '@/lib/validators';
import { getCurrentProfile, jsonError } from '@/app/api/_helpers';

export async function POST(request: Request) {
  const { supabase, profile } = await getCurrentProfile();
  if (!profile || profile.role !== 'owner') {
    return jsonError('No autorizado', 403);
  }

  const body = reconciliationSchema.safeParse(await request.json());
  if (!body.success) {
    return jsonError('Datos inválidos');
  }

  const { data: consignment, error: consignmentError } = await supabase
    .from('consignments')
    .select('*')
    .eq('id', body.data.consignment_id)
    .single();

  if (consignmentError || !consignment) {
    return jsonError('Consignación no encontrada.');
  }

  const { data: reconciliation, error: reconciliationError } = await supabase
    .from('reconciliations')
    .insert({
      consignment_id: body.data.consignment_id,
      type: body.data.type,
      cash_received: body.data.cash_received,
      transfer_received: body.data.transfer_received,
      notes: body.data.notes ?? null,
      created_by: profile.id
    })
    .select('*')
    .single();

  if (reconciliationError || !reconciliation) {
    return jsonError(reconciliationError?.message ?? 'No se pudo crear la rendición.');
  }

  for (const item of body.data.returns ?? []) {
    if (item.quantity_returned <= 0) continue;

    const { error } = await supabase.from('reconciliation_items').insert({
      reconciliation_id: reconciliation.id,
      consignment_item_id: item.consignment_item_id,
      quantity_returned: item.quantity_returned
    });

    if (error) {
      await supabase.from('reconciliations').delete().eq('id', reconciliation.id);
      return jsonError(error.message);
    }
  }

  if (body.data.type === 'total') {
    await supabase.from('consignments').update({ status: 'closed' }).eq('id', body.data.consignment_id);
  } else {
    await supabase.from('consignments').update({ status: 'partially_reconciled' }).eq('id', body.data.consignment_id);
  }

  return NextResponse.json({ message: 'Rendición registrada.' });
}
