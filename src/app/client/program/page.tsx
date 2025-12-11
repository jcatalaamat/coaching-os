"use client";

import { useClientAuth } from "@/context/ClientAuthContext";
import {
  getSessionsForClient,
  getPastSessions,
  getProgramById,
} from "@/lib/utils/helpers";
import { formatCurrency } from "@/lib/utils/formatters";

export default function ClientProgramPage() {
  const { currentClient } = useClientAuth();

  if (!currentClient) return null;

  const sessions = getSessionsForClient(currentClient.id);
  const pastSessions = getPastSessions(currentClient.id);
  const completedSessions = pastSessions.filter((s) => s.status === "completed");

  // Get unique programs from sessions
  const programIds = [...new Set(sessions.map((s) => s.programId).filter(Boolean))];
  const programs = programIds.map((id) => getProgramById(id!)).filter(Boolean);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Program
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Your enrolled coaching programs and progress
        </p>
      </div>

      {programs.length > 0 ? (
        <div className="space-y-6">
          {programs.map((program) => {
            if (!program) return null;
            const programSessions = sessions.filter((s) => s.programId === program.id);
            const programCompleted = programSessions.filter(
              (s) => s.status === "completed"
            ).length;
            const progress = program.numberOfSessions
              ? Math.round((programCompleted / program.numberOfSessions) * 100)
              : 0;

            return (
              <div
                key={program.id}
                className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {program.name}
                    </h2>
                    <span className="mt-1 inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {program.type === "1:1" ? "1:1 Coaching" : program.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(program.price, program.currency)}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {program.description}
                </p>

                {/* Progress */}
                {program.numberOfSessions && (
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {programCompleted} / {program.numberOfSessions} sessions
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {progress}% complete
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6 dark:border-gray-800">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {programSessions.length}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total Sessions
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {programCompleted}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Completed
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {program.numberOfSessions
                        ? program.numberOfSessions - programCompleted
                        : programSessions.filter((s) => s.status === "scheduled").length}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Remaining
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            No program enrolled
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Contact your coach to enroll in a coaching program.
          </p>
        </div>
      )}
    </div>
  );
}
