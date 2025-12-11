"use client";

import { PageHeader } from "@/components/common/PageHeader";
import Button from "@/components/ui/button/Button";
import { mockPrograms } from "@/lib/mock-data/programs";
import { getClientsInProgramCount } from "@/lib/utils/helpers";
import { formatCurrency } from "@/lib/utils/formatters";

const programTypeColors: Record<string, string> = {
  "1:1": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  group: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  hybrid: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        title="Programs"
        description="Manage your coaching programs and packages"
        actions={
          <Button size="sm">
            Create Program
          </Button>
        }
      />

      {/* Stats Summary */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Total Programs: <strong className="text-gray-900 dark:text-white">{mockPrograms.length}</strong>
        </span>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <span className="text-blue-600 dark:text-blue-400">
          1:1: <strong>{mockPrograms.filter((p) => p.type === "1:1").length}</strong>
        </span>
        <span className="text-purple-600 dark:text-purple-400">
          Group: <strong>{mockPrograms.filter((p) => p.type === "group").length}</strong>
        </span>
        <span className="text-amber-600 dark:text-amber-400">
          Hybrid: <strong>{mockPrograms.filter((p) => p.type === "hybrid").length}</strong>
        </span>
      </div>

      {/* Programs Grid */}
      {mockPrograms.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockPrograms.map((program) => {
            const clientCount = getClientsInProgramCount(program.id);

            return (
              <div
                key={program.id}
                className="group rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {program.name}
                    </h3>
                    <span
                      className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        programTypeColors[program.type] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {program.type === "1:1" ? "1:1 Coaching" : program.type.charAt(0).toUpperCase() + program.type.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(program.price, program.currency)}
                    </p>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {program.description}
                </p>

                <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4 text-sm dark:border-gray-800">
                  {program.numberOfSessions && (
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <svg
                        className="h-4 w-4"
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
                      <span>{program.numberOfSessions} sessions</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <svg
                      className="h-4 w-4"
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
                    <span>
                      {clientCount} {clientCount === 1 ? "client" : "clients"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Edit
                  </Button>
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
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
          <h3 className="mb-1 font-medium text-gray-900 dark:text-white">
            No programs yet
          </h3>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Create your first coaching program to start enrolling clients
          </p>
          <Button size="sm">
            Create Your First Program
          </Button>
        </div>
      )}
    </>
  );
}
