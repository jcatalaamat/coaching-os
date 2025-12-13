"use client";

import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useClients, useSessions, useNotes, usePrograms } from "@/lib/store/useStore";
import {
  formatTime,
  formatDuration,
  formatRelativeTime,
  formatCurrency,
  getInitials,
} from "@/lib/utils/formatters";

export default function DashboardPage() {
  const { clients, getClientById, getClientCountsByStatus } = useClients();
  const { getTodaySessions, getThisWeekSessions } = useSessions();
  const { getRecentNotes } = useNotes();
  const { programs, getProgramById, getClientsInProgramCount } = usePrograms();

  const todaySessions = getTodaySessions();
  const thisWeekSessions = getThisWeekSessions();
  const statusCounts = getClientCountsByStatus();
  const activeClients = statusCounts.active || 0;
  const recentNotes = getRecentNotes(5);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your coaching practice."
      />

      {/* Client Portal Demo Banner */}
      <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Client Portal Demo
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Preview what your clients see when they log in
              </p>
            </div>
          </div>
          <Link
            href="/client/dashboard"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            View Portal
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Clients
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {clients.length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
              <svg
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Clients
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {activeClients}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/10">
              <svg
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Sessions This Week
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {thisWeekSessions.length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-500/10">
              <svg
                className="h-6 w-6 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Programs
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {programs.length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-500/10">
              <svg
                className="h-6 w-6 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="mt-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Today&apos;s Schedule
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {todaySessions.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {todaySessions.map((session) => {
                const client = getClientById(session.clientId);
                const program = session.programId
                  ? getProgramById(session.programId)
                  : null;
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {client ? getInitials(client.name) : "?"}
                      </div>
                      <div>
                        <Link
                          href={`/clients/${session.clientId}`}
                          className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                        >
                          {client?.name || "Unknown Client"}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {program?.name || "No program"} •{" "}
                          {formatDuration(session.durationMinutes)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatTime(session.dateTime)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {session.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="p-6 text-center text-gray-500 dark:text-gray-400">
              No sessions scheduled for today
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Programs Summary */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Programs Summary
          </h2>
          <div className="space-y-3">
            {programs.slice(0, 4).map((program) => (
              <div
                key={program.id}
                className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {program.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {program.type}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getClientsInProgramCount(program.id)} clients
                      </span>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(program.price, program.currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notes */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Recent Notes
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            {recentNotes.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {recentNotes.map((note) => {
                  const client = getClientById(note.clientId);
                  return (
                    <div key={note.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/clients/${note.clientId}`}
                              className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                            >
                              {client?.name || "Unknown Client"}
                            </Link>
                            <StatusBadge status={client?.status || "active"} />
                          </div>
                          {note.title && (
                            <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                              {note.title}
                            </p>
                          )}
                          <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                            {note.content}
                          </p>
                        </div>
                        <span className="ml-4 shrink-0 text-xs text-gray-400">
                          {formatRelativeTime(note.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="p-6 text-center text-gray-500 dark:text-gray-400">
                No notes yet
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
