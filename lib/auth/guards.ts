import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/types';

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
  if (result.profile.role !== 'owner') {
    redirect('/seller');
  }
  return result;
}

export async function requireSeller() {
  const result = await requireAuthenticatedProfile();
  if (result.profile.role !== 'seller') {
    redirect('/owner');
  }
  return result;
}
