"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import Button from "@/components/ui/button/Button";
import { ScheduleSessionModal } from "@/components/sessions/ScheduleSessionModal";
import { AddNoteModal } from "@/components/notes/AddNoteModal";
import { useModal } from "@/hooks/useModal";
import {
  getClientById,
  getSessionsForClient,
  getNotesForClient,
  getProgramById,
  getUpcomingSessions,
  getPastSessions,
} from "@/lib/utils/helpers";
import {
  formatDate,
  formatDateTime,
  formatDuration,
  formatRelativeTime,
  getInitials,
} from "@/lib/utils/formatters";

interface ClientDetailPageProps {
  params: Promise<{ clientId: string }>;
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { clientId } = use(params);
  const client = getClientById(clientId);
  const { isOpen: isScheduleModalOpen, openModal: openScheduleModal, closeModal: closeScheduleModal } = useModal();
  const { isOpen: isNoteModalOpen, openModal: openNoteModal, closeModal: closeNoteModal } = useModal();

  if (!client) {
    notFound();
  }

  const allSessions = getSessionsForClient(clientId);
  const upcomingSessions = getUpcomingSessions(clientId);
  const pastSessions = getPastSessions(clientId);
  const notes = getNotesForClient(clientId);

  // Get unique program IDs from sessions
  const programIds = [...new Set(allSessions.map((s) => s.programId).filter(Boolean))];
  const programs = programIds.map((id) => getProgramById(id!)).filter(Boolean);

  return (
    <>
      <PageHeader
        title={client.name}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/client/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View as Client
            </Link>
            <Button size="sm" variant="outline" onClick={openScheduleModal}>
              Schedule Session
            </Button>
            <Button size="sm" onClick={openNoteModal}>New Note</Button>
          </div>
        }
      />

      <ScheduleSessionModal
        isOpen={isScheduleModalOpen}
        onClose={closeScheduleModal}
        preselectedClientId={clientId}
        onSave={(session) => {
          console.log("New session:", session);
          alert(`Session scheduled for ${client.name}! (Demo only - not persisted)`);
        }}
      />

      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={closeNoteModal}
        clientId={clientId}
        onSave={(note) => {
          console.log("New note:", note);
          alert(`Note saved for ${client.name}! (Demo only - not persisted)`);
        }}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-1">
          {/* Client Info Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <span className="text-xl font-semibold">
                  {getInitials(client.name)}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {client.name}
                </h2>
                {client.email && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {client.email}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={client.status} />
              {client.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div>
                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {client.phone || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {client.email || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Client Since
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatDate(client.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Total Sessions
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {allSessions.length}
                </p>
              </div>
            </div>
          </div>

          {/* Programs */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Programs
            </h3>
            {programs.length > 0 ? (
              <div className="space-y-3">
                {programs.map((program) => (
                  <div
                    key={program!.id}
                    className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {program!.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        {program!.type}
                      </span>
                      {program!.numberOfSessions && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {program!.numberOfSessions} sessions
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No programs assigned
              </p>
            )}
          </div>

          {/* Upcoming Sessions */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Upcoming Sessions
            </h3>
            {upcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {upcomingSessions.slice(0, 3).map((session) => {
                  const program = session.programId
                    ? getProgramById(session.programId)
                    : null;
                  return (
                    <div
                      key={session.id}
                      className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
                    >
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDateTime(session.dateTime)}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatDuration(session.durationMinutes)}</span>
                        <span>•</span>
                        <span>{session.location}</span>
                      </div>
                      {program && (
                        <p className="mt-1 text-xs text-gray-400">
                          {program.name}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No upcoming sessions
              </p>
            )}
          </div>

          {/* Session History */}
          {pastSessions.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Session History
              </h3>
              <div className="space-y-2">
                {pastSessions.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatDate(session.dateTime)}
                    </span>
                    <StatusBadge status={session.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Notes */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Notes Timeline
            </h3>
            {notes.length > 0 ? (
              <div className="space-y-4">
                {notes.map((note, index) => (
                  <div
                    key={note.id}
                    className={`relative pl-6 ${
                      index !== notes.length - 1
                        ? "border-l-2 border-gray-200 pb-4 dark:border-gray-700"
                        : ""
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-[5px] top-0 h-3 w-3 rounded-full bg-blue-500" />

                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                      <div className="flex items-start justify-between">
                        <div>
                          {note.title && (
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {note.title}
                            </h4>
                          )}
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {note.content}
                          </p>
                        </div>
                        <span className="ml-4 shrink-0 text-xs text-gray-400">
                          {formatRelativeTime(note.createdAt)}
                        </span>
                      </div>
                      {note.sessionId && (
                        <p className="mt-2 text-xs text-gray-400">
                          From session on {formatDate(note.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                No notes yet. Add your first note to start tracking progress.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
