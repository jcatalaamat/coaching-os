import { useMemo } from "react";
import { Session } from "@/types/entities";
import { SessionBlock } from "./SessionBlock";
import {
  getWeekDays,
  isSameDay,
  isToday,
  formatHour,
  formatDayOfWeek,
} from "@/lib/utils/formatters";

interface WeekViewProps {
  currentDate: Date;
  sessions: Session[];
  getClientName: (clientId: string) => string;
  onTimeSlotClick: (date: Date, hour: number) => void;
  onSessionClick: (session: Session) => void;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7 AM to 7 PM

export function WeekView({
  currentDate,
  sessions,
  getClientName,
  onTimeSlotClick,
  onSessionClick,
}: WeekViewProps) {
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const getSessionsForDay = (date: Date) => {
    return sessions.filter((s) => isSameDay(s.dateTime, date));
  };

  const getSessionPosition = (session: Session) => {
    const hour = session.dateTime.getHours();
    const minutes = session.dateTime.getMinutes();
    const top = (hour - 7) * 48 + (minutes / 60) * 48; // 48px per hour (h-12)
    const height = (session.durationMinutes / 60) * 48;
    return { top: `${top}px`, height: `${Math.max(height, 24)}px` };
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header with day names */}
      <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-800">
        <div className="p-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          {/* Empty cell for time column */}
        </div>
        {weekDays.map((day, index) => {
          const today = isToday(day);
          return (
            <div
              key={index}
              className={`p-3 text-center border-l border-gray-200 dark:border-gray-800 ${
                today ? "bg-blue-50 dark:bg-blue-900/10" : ""
              }`}
            >
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {formatDayOfWeek(day)}
              </p>
              <p
                className={`mt-1 text-lg font-semibold ${
                  today
                    ? "flex h-8 w-8 mx-auto items-center justify-center rounded-full bg-blue-600 text-white"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {day.getDate()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="grid grid-cols-8">
        {/* Time column */}
        <div className="border-r border-gray-200 dark:border-gray-800">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="h-12 flex items-start justify-end pr-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800"
            >
              <span className="-mt-2">{formatHour(hour)}</span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((day, dayIndex) => {
          const daySessions = getSessionsForDay(day);
          const today = isToday(day);

          return (
            <div
              key={dayIndex}
              className={`relative border-l border-gray-200 dark:border-gray-800 ${
                today ? "bg-blue-50/30 dark:bg-blue-900/5" : ""
              }`}
            >
              {/* Hour grid lines */}
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  onClick={() => onTimeSlotClick(day, hour)}
                  className="h-12 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                />
              ))}

              {/* Sessions */}
              {daySessions.map((session) => {
                const sessionHour = session.dateTime.getHours();
                if (sessionHour < 7 || sessionHour > 19) return null;

                const position = getSessionPosition(session);
                return (
                  <div
                    key={session.id}
                    className="absolute left-1 right-1"
                    style={position}
                  >
                    <SessionBlock
                      session={session}
                      clientName={getClientName(session.clientId)}
                      onClick={() => onSessionClick(session)}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
