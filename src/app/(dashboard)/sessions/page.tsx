"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import Button from "@/components/ui/button/Button";
import { ScheduleSessionModal } from "@/components/sessions/ScheduleSessionModal";
import { useModal } from "@/hooks/useModal";
import { useSessions, useClients, usePrograms } from "@/lib/store/useStore";
import {
  formatDateTime,
  formatDuration,
  getInitials,
} from "@/lib/utils/formatters";

type DateRange = "all" | "today" | "week" | "month";
type StatusFilter = "all" | "scheduled" | "completed" | "cancelled";

export default function SessionsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { isOpen: isScheduleModalOpen, openModal: openScheduleModal, closeModal: closeScheduleModal } = useModal();

  const { sessions, addSession, filterSessionsByStatus, filterSessionsByDateRange } = useSessions();
  const { getClientById } = useClients();
  const { getProgramById } = usePrograms();

  const filteredSessions = useMemo(() => {
    let filtered = [...sessions];

    // Apply date range filter
    filtered = filterSessionsByDateRange(filtered, dateRange);

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filterSessionsByStatus(filtered, statusFilter);
    }

    // Sort: upcoming first, then by date
    filtered.sort((a, b) => {
      const now = new Date();
      const aIsFuture = a.dateTime > now;
      const bIsFuture = b.dateTime > now;

      if (aIsFuture && !bIsFuture) return -1;
      if (!aIsFuture && bIsFuture) return 1;

      // Both future: soonest first; both past: most recent first
      if (aIsFuture) {
        return a.dateTime.getTime() - b.dateTime.getTime();
      }
      return b.dateTime.getTime() - a.dateTime.getTime();
    });

    return filtered;
  }, [dateRange, statusFilter, sessions, filterSessionsByDateRange, filterSessionsByStatus]);

  // Stats
  const totalSessions = sessions.length;
  const scheduledCount = sessions.filter((s) => s.status === "scheduled").length;
  const completedCount = sessions.filter((s) => s.status === "completed").length;
  const cancelledCount = sessions.filter((s) => s.status === "cancelled").length;

  return (
    <>
      <PageHeader
        title="Sessions"
        description="View and manage all your coaching sessions"
        actions={
          <Button size="sm" onClick={openScheduleModal}>
            Schedule Session
          </Button>
        }
      />

      <ScheduleSessionModal
        isOpen={isScheduleModalOpen}
        onClose={closeScheduleModal}
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

      {/* Stats Summary */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Total: <strong className="text-gray-900 dark:text-white">{totalSessions}</strong>
        </span>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <span className="text-blue-600 dark:text-blue-400">
          Scheduled: <strong>{scheduledCount}</strong>
        </span>
        <span className="text-green-600 dark:text-green-400">
          Completed: <strong>{completedCount}</strong>
        </span>
        <span className="text-red-600 dark:text-red-400">
          Cancelled: <strong>{cancelledCount}</strong>
        </span>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as DateRange)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Sessions Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Program
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => {
                  const client = getClientById(session.clientId);
                  const program = session.programId
                    ? getProgramById(session.programId)
                    : null;

                  return (
                    <tr
                      key={session.id}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatDateTime(session.dateTime)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {client ? (
                          <Link
                            href={`/clients/${client.id}`}
                            className="flex items-center gap-3"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                              {getInitials(client.name)}
                            </div>
                            <span className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                              {client.name}
                            </span>
                          </Link>
                        ) : (
                          <span className="text-gray-400">Unknown</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {program ? program.name : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDuration(session.durationMinutes)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={session.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {session.location}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    {dateRange !== "all" || statusFilter !== "all"
                      ? "No sessions match your filters."
                      : "No sessions scheduled yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
