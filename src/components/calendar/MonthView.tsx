import { useMemo } from "react";
import { Session } from "@/types/entities";
import { SessionBlock } from "./SessionBlock";
import {
  getMonthDays,
  getMonthStart,
  isSameDay,
  isToday,
} from "@/lib/utils/formatters";

interface MonthViewProps {
  currentDate: Date;
  sessions: Session[];
  getClientName: (clientId: string) => string;
  onDayClick: (date: Date) => void;
  onSessionClick: (session: Session) => void;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthView({
  currentDate,
  sessions,
  getClientName,
  onDayClick,
  onSessionClick,
}: MonthViewProps) {
  const days = useMemo(() => getMonthDays(currentDate), [currentDate]);
  const monthStart = getMonthStart(currentDate);

  const getSessionsForDay = (date: Date) => {
    return sessions.filter((s) => isSameDay(s.dateTime, date));
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === monthStart.getMonth();
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
        {DAY_NAMES.map((day) => (
          <div
            key={day}
            className="px-2 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const daySessions = getSessionsForDay(day);
          const inCurrentMonth = isCurrentMonth(day);
          const today = isToday(day);

          return (
            <div
              key={index}
              onClick={() => onDayClick(day)}
              className={`min-h-[100px] border-b border-r border-gray-100 p-2 cursor-pointer transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02] ${
                !inCurrentMonth ? "bg-gray-50/50 dark:bg-gray-900/20" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-sm font-medium ${
                    today
                      ? "flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white"
                      : inCurrentMonth
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>

              <div className="space-y-1">
                {daySessions.slice(0, 3).map((session) => (
                  <SessionBlock
                    key={session.id}
                    session={session}
                    clientName={getClientName(session.clientId)}
                    compact
                    onClick={() => {
                      onSessionClick(session);
                    }}
                  />
                ))}
                {daySessions.length > 3 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +{daySessions.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
