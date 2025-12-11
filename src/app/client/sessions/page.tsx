"use client";

import { useClientAuth } from "@/context/ClientAuthContext";
import {
  getUpcomingSessions,
  getPastSessions,
  getProgramById,
} from "@/lib/utils/helpers";
import {
  formatDateTime,
  formatDuration,
} from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/common/StatusBadge";

export default function ClientSessionsPage() {
  const { currentClient } = useClientAuth();

  if (!currentClient) return null;

  const upcomingSessions = getUpcomingSessions(currentClient.id);
  const pastSessions = getPastSessions(currentClient.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Sessions
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          View your upcoming and past coaching sessions
        </p>
      </div>

      {/* Upcoming Sessions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
          Upcoming Sessions
        </h2>
        {upcomingSessions.length > 0 ? (
          <div className="space-y-4">
            {upcomingSessions.map((session) => {
              const program = session.programId ? getProgramById(session.programId) : null;
              return (
                <div
                  key={session.id}
                  className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {formatDateTime(session.dateTime)}
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{formatDuration(session.durationMinutes)}</span>
                      <span>|</span>
                      <span>{session.location}</span>
                    </div>
                    {program && (
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        {program.name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={session.status} />
                    <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
                      Join
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-8 text-center text-gray-500 dark:text-gray-400">
            No upcoming sessions scheduled. Contact your coach to book a session.
          </p>
        )}
      </div>

      {/* Past Sessions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
          Past Sessions
        </h2>
        {pastSessions.length > 0 ? (
          <div className="space-y-3">
            {pastSessions.map((session) => {
              const program = session.programId ? getProgramById(session.programId) : null;
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-700"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDateTime(session.dateTime)}
                    </p>
                    <div className="mt-1 flex gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{formatDuration(session.durationMinutes)}</span>
                      {program && (
                        <>
                          <span>|</span>
                          <span>{program.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={session.status} />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-8 text-center text-gray-500 dark:text-gray-400">
            No past sessions yet.
          </p>
        )}
      </div>
    </div>
  );
}
