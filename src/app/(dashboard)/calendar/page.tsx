"use client";

import { useState, useMemo, useCallback } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { MonthView } from "@/components/calendar/MonthView";
import { WeekView } from "@/components/calendar/WeekView";
import { ScheduleSessionModal } from "@/components/sessions/ScheduleSessionModal";
import { useModal } from "@/hooks/useModal";
import { useClients, useSessions } from "@/lib/store/useStore";
import { Session } from "@/types/entities";
import {
  getWeekStart,
  getWeekEnd,
  getMonthStart,
  getMonthEnd,
} from "@/lib/utils/formatters";

type CalendarView = "week" | "month";

export default function CalendarPage() {
  const [view, setView] = useState<CalendarView>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [preselectedDate, setPreselectedDate] = useState<string | null>(null);
  const [preselectedTime, setPreselectedTime] = useState<string | null>(null);

  const { isOpen, openModal, closeModal } = useModal();
  const { sessions, addSession } = useSessions();
  const { getClientById } = useClients();

  const getClientName = useCallback(
    (clientId: string) => {
      const client = getClientById(clientId);
      return client?.name || "Unknown Client";
    },
    [getClientById]
  );

  const visibleSessions = useMemo(() => {
    const start = view === "week" ? getWeekStart(currentDate) : getMonthStart(currentDate);
    const end = view === "week" ? getWeekEnd(currentDate) : getMonthEnd(currentDate);
    return sessions.filter((s) => s.dateTime >= start && s.dateTime <= end);
  }, [sessions, currentDate, view]);

  const handlePrev = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (view === "week") {
        d.setDate(d.getDate() - 7);
      } else {
        d.setMonth(d.getMonth() - 1);
      }
      return d;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (view === "week") {
        d.setDate(d.getDate() + 7);
      } else {
        d.setMonth(d.getMonth() + 1);
      }
      return d;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleScheduleClick = () => {
    setPreselectedDate(null);
    setPreselectedTime(null);
    openModal();
  };

  const handleDayClick = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    setPreselectedDate(dateStr);
    setPreselectedTime("09:00");
    openModal();
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    const dateStr = date.toISOString().split("T")[0];
    const timeStr = `${hour.toString().padStart(2, "0")}:00`;
    setPreselectedDate(dateStr);
    setPreselectedTime(timeStr);
    openModal();
  };

  const handleSessionClick = (session: Session) => {
    // For now, just alert session details - could open edit modal later
    const client = getClientById(session.clientId);
    alert(`Session with ${client?.name || "Unknown"}\n${session.dateTime.toLocaleString()}\nStatus: ${session.status}`);
  };

  const handleModalClose = () => {
    setPreselectedDate(null);
    setPreselectedTime(null);
    closeModal();
  };

  return (
    <>
      <PageHeader
        title="Calendar"
        description="View and manage your coaching sessions"
      />

      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onScheduleClick={handleScheduleClick}
      />

      {view === "week" ? (
        <WeekView
          currentDate={currentDate}
          sessions={visibleSessions}
          getClientName={getClientName}
          onTimeSlotClick={handleTimeSlotClick}
          onSessionClick={handleSessionClick}
        />
      ) : (
        <MonthView
          currentDate={currentDate}
          sessions={visibleSessions}
          getClientName={getClientName}
          onDayClick={handleDayClick}
          onSessionClick={handleSessionClick}
        />
      )}

      <ScheduleSessionModal
        isOpen={isOpen}
        onClose={handleModalClose}
        preselectedDate={preselectedDate || undefined}
        preselectedTime={preselectedTime || undefined}
        onSave={(sessionData) => {
          const dateTime = new Date(`${sessionData.date}T${sessionData.time}`);
          addSession({
            clientId: sessionData.clientId,
            programId: sessionData.programId || undefined,
            dateTime,
            durationMinutes: sessionData.duration,
            status: "scheduled",
            location: sessionData.location,
          });
        }}
      />
    </>
  );
}
