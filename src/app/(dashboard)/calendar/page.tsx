"use client";

import { useState, useMemo, useCallback } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { MonthView } from "@/components/calendar/MonthView";
import { WeekView } from "@/components/calendar/WeekView";
import { ScheduleSessionModal } from "@/components/sessions/ScheduleSessionModal";
import { SessionDetailsModal } from "@/components/sessions/SessionDetailsModal";
import { useModal } from "@/hooks/useModal";
import { useClients, useSessions } from "@/lib/store/useStore";
import { useToast } from "@/context/ToastContext";
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
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const { isOpen: isScheduleOpen, openModal: openScheduleModal, closeModal: closeScheduleModal } = useModal();
  const { isOpen: isDetailsOpen, openModal: openDetailsModal, closeModal: closeDetailsModal } = useModal();
  const { showToast } = useToast();
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
    openScheduleModal();
  };

  const handleDayClick = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    setPreselectedDate(dateStr);
    setPreselectedTime("09:00");
    openScheduleModal();
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    const dateStr = date.toISOString().split("T")[0];
    const timeStr = `${hour.toString().padStart(2, "0")}:00`;
    setPreselectedDate(dateStr);
    setPreselectedTime(timeStr);
    openScheduleModal();
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    openDetailsModal();
  };

  const handleScheduleModalClose = () => {
    setPreselectedDate(null);
    setPreselectedTime(null);
    closeScheduleModal();
  };

  const handleDetailsModalClose = () => {
    setSelectedSession(null);
    closeDetailsModal();
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
        isOpen={isScheduleOpen}
        onClose={handleScheduleModalClose}
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
          showToast("Session scheduled successfully");
        }}
      />

      <SessionDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleDetailsModalClose}
        session={selectedSession}
      />
    </>
  );
}
