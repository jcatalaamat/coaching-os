import { Session } from "@/types/entities";
import { formatTime, formatDuration } from "@/lib/utils/formatters";

interface SessionBlockProps {
  session: Session;
  clientName: string;
  compact?: boolean;
  onClick?: () => void;
}

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300",
  completed: "bg-green-100 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300",
  cancelled: "bg-red-100 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300",
};

export function SessionBlock({ session, clientName, compact = false, onClick }: SessionBlockProps) {
  const colorClass = statusColors[session.status] || statusColors.scheduled;

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`w-full truncate rounded px-1.5 py-0.5 text-left text-xs font-medium border ${colorClass} hover:opacity-80 transition-opacity`}
      >
        {formatTime(session.dateTime)} {clientName}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-2 text-left ${colorClass} hover:opacity-80 transition-opacity`}
    >
      <p className="truncate text-sm font-medium">{clientName}</p>
      <p className="text-xs opacity-80">
        {formatTime(session.dateTime)} • {formatDuration(session.durationMinutes)}
      </p>
    </button>
  );
}
