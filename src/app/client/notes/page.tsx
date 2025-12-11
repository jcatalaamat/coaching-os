"use client";

import { useClientAuth } from "@/context/ClientAuthContext";
import { getNotesForClient } from "@/lib/utils/helpers";
import { formatRelativeTime, formatDate } from "@/lib/utils/formatters";

export default function ClientNotesPage() {
  const { currentClient } = useClientAuth();

  if (!currentClient) return null;

  const notes = getNotesForClient(currentClient.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notes & Homework
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Notes and action items from your coaching sessions
        </p>
      </div>

      {/* Notes Timeline */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        {notes.length > 0 ? (
          <div className="space-y-6">
            {notes.map((note, index) => (
              <div
                key={note.id}
                className={`relative pl-6 ${
                  index !== notes.length - 1
                    ? "border-l-2 border-gray-200 pb-6 dark:border-gray-700"
                    : ""
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute -left-[5px] top-0 h-3 w-3 rounded-full bg-blue-500" />

                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {note.title && (
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {note.title}
                        </h3>
                      )}
                      <p className="mt-2 whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                        {note.content}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <span>{formatDate(note.createdAt)}</span>
                    <span>|</span>
                    <span>{formatRelativeTime(note.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-gray-500 dark:text-gray-400">
            No notes from your coach yet. Notes will appear here after your sessions.
          </p>
        )}
      </div>

      {/* Homework Section (Placeholder) */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
          Action Items
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              defaultChecked
            />
            <span className="text-gray-600 line-through dark:text-gray-400">
              Complete reflection worksheet
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-900 dark:text-white">
              Practice boundary-setting conversation
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-900 dark:text-white">
              Daily journaling (10 min)
            </span>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          Homework tracking coming soon
        </p>
      </div>
    </div>
  );
}
