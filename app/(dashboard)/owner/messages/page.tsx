import { requireOwner } from '@/lib/auth/guards';
import { OwnerMessageForm } from '@/components/forms/create-message-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import type { InternalMessage, Profile } from '@/lib/types';

export default async function OwnerMessagesPage() {
  const { supabase, profile } = await requireOwner();

  const [{ data: sellers }, { data: messages }] = await Promise.all([
    supabase.from('profiles').select('*').eq('role', 'seller').order('display_name'),
    supabase.from('internal_messages').select('*').eq('owner_id', profile.id).order('created_at', { ascending: false }).limit(100)
  ]);

  const sellerMap = new Map(((sellers as Profile[]) ?? []).map((item) => [item.id, item.display_name ?? item.email ?? item.id]));

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <OwnerMessageForm sellers={(sellers as Profile[]) ?? []} />
      <Card>
        <CardHeader>
          <CardTitle>Historial reciente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {((messages as InternalMessage[]) ?? []).map((message) => (
            <div key={message.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-medium text-white">{sellerMap.get(message.seller_id) ?? message.seller_id}</div>
                <div className="text-xs text-zinc-500">{formatDate(message.created_at)}</div>
              </div>
              <div className="mt-2 text-sm text-zinc-300">{message.body}</div>
              <div className="mt-2 text-xs text-zinc-500">
                {message.sender_id === profile.id ? 'Enviado por dueño' : 'Enviado por vendedor'}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
