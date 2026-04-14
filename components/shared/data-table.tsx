import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DataTable({
  title,
  headers,
  rows
}: {
  title: string;
  headers: string[];
  rows: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
