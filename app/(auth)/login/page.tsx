import { LoginForm } from '@/components/forms/login-form';

export default function LoginPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <LoginForm error={searchParams?.error} />
    </main>
  );
}
