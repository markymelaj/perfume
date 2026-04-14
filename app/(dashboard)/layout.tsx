import Link from 'next/link';
import { headers } from 'next/headers';
import { requireAuthenticatedProfile } from '@/lib/auth/guards';
import { DashboardNav } from '@/components/shared/nav';
import { Badge } from '@/components/ui/badge';

const ownerItems = [
  { href: '/owner', label: 'Resumen' },
  { href: '/owner/users', label: 'Usuarios' },
  { href: '/owner/products', label: 'Productos' },
  { href: '/owner/consignments', label: 'Consignaciones' },
  { href: '/owner/reconciliations', label: 'Rendiciones' },
  { href: '/owner/messages', label: 'Mensajes' },
  { href: '/owner/locations', label: 'Ubicaciones' },
  { href: '/owner/audit', label: 'Auditoría' }
];

const sellerItems = [
  { href: '/seller', label: 'Resumen' },
  { href: '/seller/stock', label: 'Mi stock' },
  { href: '/seller/sales', label: 'Ventas' },
  { href: '/seller/cash', label: 'Caja' },
  { href: '/seller/messages', label: 'Mensajes' },
  { href: '/seller/location', label: 'Ubicación' }
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAuthenticatedProfile();
  const pathname = (await headers()).get('x-current-path') ?? '';
  const items = profile.role === 'owner' ? ownerItems : sellerItems;

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-zinc-900 bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-zinc-500">Consigna Privada</div>
              <div className="mt-1 flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-white">{profile.display_name ?? profile.email}</h1>
                <Badge variant={profile.role === 'owner' ? 'success' : 'default'}>{profile.role}</Badge>
                {profile.must_reenroll_security ? <Badge variant="warning">Reforzar acceso pendiente</Badge> : null}
              </div>
            </div>
            <Link href="/logout" className="rounded-full border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900">
              Cerrar sesión
            </Link>
          </div>
          <DashboardNav items={items} currentPath={pathname} />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
