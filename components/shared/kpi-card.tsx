import { Card, CardContent } from '@/components/ui/card';

export function KpiCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-1">
        <div className="text-sm text-zinc-500">{label}</div>
        <div className="text-3xl font-semibold text-white">{value}</div>
        {hint ? <div className="text-xs text-zinc-500">{hint}</div> : null}
      </CardContent>
    </Card>
  );
}
