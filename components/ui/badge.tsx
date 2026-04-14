import { cn } from '@/lib/utils';

export function Badge({
  children,
  variant = 'default'
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning';
}) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2.5 py-1 text-xs font-medium',
        variant === 'default' && 'border-zinc-700 bg-zinc-900 text-zinc-200',
        variant === 'success' && 'border-emerald-900 bg-emerald-950 text-emerald-300',
        variant === 'warning' && 'border-amber-900 bg-amber-950 text-amber-300'
      )}
    >
      {children}
    </span>
  );
}
