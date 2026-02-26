import { Inbox } from 'lucide-react';

export function EmptyState({ message = 'No data available' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <Inbox size={48} className="mb-4 opacity-50" />
      <p className="text-lg">{message}</p>
    </div>
  );
}
