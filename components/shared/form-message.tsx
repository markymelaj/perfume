export function FormMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="text-sm text-zinc-400">{message}</p>;
}
