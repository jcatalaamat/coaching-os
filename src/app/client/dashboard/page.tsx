"use client";

import Link from "next/link";
import { useClientAuth } from "@/context/ClientAuthContext";
import {
  getSessionsForClient,
  getNotesForClient,
  getUpcomingSessions,
  getPastSessions,
  getProgramById,
} from "@/lib/utils/helpers";
import {
  formatDateTime,
  formatDuration,
  formatRelativeTime,
} from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/common/StatusBadge";

export default function ClientDashboardPage() {
  const { currentClient } = useClientAuth();

  if (!currentClient) return null;

  const allSessions = getSessionsForClient(currentClient.id);
  const upcomingSessions = getUpcomingSessions(currentClient.id);
  const pastSessions = getPastSessions(currentClient.id);
  const notes = getNotesForClient(currentClient.id);
  const completedSessions = pastSessions.filter((s) => s.status === "completed");

  // Get the next session
  const nextSession = upcomingSessions[0];
  const nextProgram = nextSession?.programId ? getProgramById(nextSession.programId) : null;

  // Calculate days until next session
  const daysUntilNext = nextSession
    ? Math.ceil((nextSession.dateTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {currentClient.name.split(" ")[0]}!</h1>
        <p className="mt-2 text-blue-100">
          {nextSession
            ? `Your next session is ${formatRelativeTime(nextSession.dateTime)}`
            : "No upcoming sessions scheduled"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Sessions Completed</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {completedSessions.length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {upcomingSessions.length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Sessions</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {allSessions.length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Notes from Coach</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {notes.length}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Next Session Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
            Next Session
          </h2>
          {nextSession ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatDateTime(nextSession.dateTime)}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>{formatDuration(nextSession.durationMinutes)}</span>
                  <span>|</span>
                  <span>{nextSession.location}</span>
                </div>
                {nextProgram && (
                  <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                    {nextProgram.name}
                  </p>
                )}
              </div>
              {daysUntilNext !== null && daysUntilNext <= 1 && (
                <button className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
                  Join Session
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No upcoming sessions. Contact your coach to schedule.
            </p>
          )}
        </div>

        {/* Recent Notes */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Recent Notes from Coach
            </h2>
            <Link
              href="/client/notes"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              View All
            </Link>
          </div>
          {notes.length > 0 ? (
            <div className="space-y-3">
              {notes.slice(0, 3).map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
                >
                  {note.title && (
                    <p className="font-medium text-gray-900 dark:text-white">
                      {note.title}
                    </p>
                  )}
                  <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                    {note.content}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {formatRelativeTime(note.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No notes yet.
            </p>
          )}
        </div>
      </div>

      {/* Session History Preview */}
      {pastSessions.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Recent Sessions
            </h2>
            <Link
              href="/client/sessions"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              View All
            </Link>
          </div>
          <div className="space-y-2">
            {pastSessions.slice(0, 3).map((session) => {
              const program = session.programId ? getProgramById(session.programId) : null;
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDateTime(session.dateTime)}
                    </p>
                    {program && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {program.name}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={session.status} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
