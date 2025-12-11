"use client";

import { useState } from "react";
import { Client, Session, Program } from "@/types/entities";
import { formatDate } from "@/lib/utils/formatters";

interface AISummaryButtonProps {
  client: Client;
  session?: Session;
  program?: Program | null;
}

// Mock AI summaries for demo
const mockSummaries = [
  {
    topics: ["Career transition planning", "Work-life balance strategies"],
    progress: "Client showing strong commitment to making changes. Notable shift in mindset around prioritizing personal time.",
    actions: ["Update resume with new accomplishments", "Schedule informational interviews with 3 people in target industry"],
    insight: "Consider exploring the underlying beliefs about success that may be driving overwork patterns.",
  },
  {
    topics: ["Leadership development", "Team communication"],
    progress: "Significant improvement in delegation skills. Team feedback has been increasingly positive.",
    actions: ["Practice active listening in next team meeting", "Document wins and share with manager"],
    insight: "The connection between self-confidence and leadership style is becoming clearer. Worth exploring in next session.",
  },
  {
    topics: ["Goal setting", "Accountability structures"],
    progress: "Client has established consistent morning routine. Energy levels reported as improved.",
    actions: ["Continue tracking habits for 2 more weeks", "Identify one area to add structure"],
    insight: "Small wins are building momentum. Focus on celebrating progress rather than perfection.",
  },
];

export function AISummaryButton({ client, session, program }: AISummaryButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<typeof mockSummaries[0] | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsOpen(true);

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Pick a random mock summary
    const randomSummary = mockSummaries[Math.floor(Math.random() * mockSummaries.length)];
    setSummary(randomSummary);
    setIsGenerating(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSummary(null);
  };

  return (
    <>
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-purple-600 hover:to-blue-600 disabled:opacity-50"
      >
        <svg
          className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isGenerating ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          )}
        </svg>
        {isGenerating ? "Generating..." : "AI Summary"}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  AI Session Summary
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {client.name} {session && `| ${formatDate(session.dateTime)}`}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-500" />
                <p className="text-gray-500 dark:text-gray-400">Analyzing session data...</p>
              </div>
            ) : summary ? (
              <div className="space-y-6">
                {/* Topics */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                    Key Topics Discussed
                  </h3>
                  <ul className="space-y-1">
                    {summary.topics.map((topic, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span className="text-purple-500">-</span> {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Progress */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                    Client Progress
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">{summary.progress}</p>
                </div>

                {/* Action Items */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                    Action Items
                  </h3>
                  <ul className="space-y-2">
                    {summary.actions.map((action, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 rounded-lg bg-blue-50 p-2 text-gray-700 dark:bg-blue-900/20 dark:text-gray-300"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                          {i + 1}
                        </span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Coach Notes */}
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
                  <h3 className="mb-2 text-sm font-semibold text-purple-700 dark:text-purple-400">
                    Coach Notes
                  </h3>
                  <p className="text-sm text-purple-800 dark:text-purple-300">{summary.insight}</p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                  <p className="text-xs text-gray-400">Generated by Coaching OS AI</p>
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700">
                      Copy
                    </button>
                    <button className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600">
                      Save to Notes
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
