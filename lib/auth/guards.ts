import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function requireAuthenticatedProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.is_active) {
    redirect('/login?error=inactive');
  }

  return { supabase, user, profile };
}

export async function requireOwner() {
  const result = await requireAuthenticatedProfile();
  if (!['owner', 'super_admin'].includes(result.profile.role)) {
    redirect('/seller');
  }
  return result;
}

export async function requireSeller() {
  const result = await requireAuthenticatedProfile();
  if (result.profile.role === 'seller') {
    return result;
  }
  redirect('/owner');
}
