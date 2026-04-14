import { requireSeller } from '@/lib/auth/guards';
import { SellerMessageForm } from '@/components/forms/create-message-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import type { InternalMessage, Profile } from '@/lib/types';

export default async function SellerMessagesPage() {
  const { supabase, profile } = await requireSeller();

  const { data: owner } = await supabase.from('profiles').select('*').eq('role', 'owner').eq('is_active', true).limit(1).single();
  const { data: messages } = await supabase
    .from('internal_messages')
    .select('*')
    .eq('seller_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <SellerMessageForm />
      <Card>
        <CardHeader>
          <CardTitle>Conversación con dueño</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {((messages as InternalMessage[]) ?? []).map((message) => (
            <div key={message.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-medium text-white">
                  {message.sender_id === profile.id ? profile.display_name ?? 'Tú' : owner?.display_name ?? 'Dueño'}
                </div>
                <div className="text-xs text-zinc-500">{formatDate(message.created_at)}</div>
              </div>
              <div className="mt-2 text-sm text-zinc-300">{message.body}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
