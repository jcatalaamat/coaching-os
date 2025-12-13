import Button from "@/components/ui/button/Button";
import { formatMonthYear } from "@/lib/utils/formatters";

type CalendarView = "week" | "month";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onScheduleClick: () => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onScheduleClick,
}: CalendarHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onNext}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Today button */}
        <button
          onClick={onToday}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Today
        </button>

        {/* Current date */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {formatMonthYear(currentDate)}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* View toggle */}
        <div className="flex rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={() => onViewChange("week")}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              view === "week"
                ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            } rounded-l-lg`}
          >
            Week
          </button>
          <button
            onClick={() => onViewChange("month")}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              view === "month"
                ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            } rounded-r-lg`}
          >
            Month
          </button>
        </div>

        {/* Schedule button */}
        <Button size="sm" onClick={onScheduleClick}>
          Schedule Session
        </Button>
      </div>
    </div>
  );
}
