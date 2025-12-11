"use client";

import { useState } from "react";
import { Client, Program } from "@/types/entities";

interface AIHomeworkSuggestionsProps {
  client: Client;
  program?: Program | null;
}

// Mock homework suggestions for demo
const mockHomeworkSets = [
  [
    { title: "Daily journaling", description: "Spend 10 minutes each morning writing about goals and intentions" },
    { title: "Practice boundary-setting", description: "Identify one situation this week to practice saying no" },
    { title: "Complete reflection worksheet", description: "Fill out the provided self-assessment form before next session" },
    { title: "Schedule self-care activity", description: "Block 2 hours for an activity that brings you joy" },
  ],
  [
    { title: "Track energy levels", description: "Note your energy at 3 points during each day for one week" },
    { title: "Have a difficult conversation", description: "Address one pending issue you've been avoiding" },
    { title: "Read assigned chapter", description: "Complete reading and note 3 key takeaways" },
    { title: "Gratitude practice", description: "Write 3 things you're grateful for each evening" },
  ],
  [
    { title: "Morning routine experiment", description: "Try the new morning routine for 5 days and report results" },
    { title: "Delegation challenge", description: "Delegate one task you would normally do yourself" },
    { title: "Networking outreach", description: "Reach out to 2 people in your target network" },
    { title: "Vision board update", description: "Add or update images that represent your current goals" },
  ],
];

export function AIHomeworkSuggestions({ client, program }: AIHomeworkSuggestionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof mockHomeworkSets[0] | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsOpen(true);
    setSelectedItems(new Set());

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Pick a random set of suggestions
    const randomSet = mockHomeworkSets[Math.floor(Math.random() * mockHomeworkSets.length)];
    setSuggestions(randomSet);
    setIsGenerating(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSuggestions(null);
    setSelectedItems(new Set());
  };

  const toggleItem = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const handleAssign = () => {
    // In a real app, this would save to the database
    alert(`Assigned ${selectedItems.size} homework items to ${client.name}`);
    handleClose();
  };

  return (
    <>
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition-all hover:bg-purple-100 disabled:opacity-50 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30"
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          )}
        </svg>
        {isGenerating ? "Generating..." : "Suggest Homework"}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Suggested Homework
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  For {client.name}
                  {program && ` | ${program.name}`}
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
                <p className="text-gray-500 dark:text-gray-400">Generating personalized homework...</p>
              </div>
            ) : suggestions ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select items to assign to your client:
                </p>

                <div className="space-y-3">
                  {suggestions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => toggleItem(index)}
                      className={`w-full rounded-lg border p-4 text-left transition-all ${
                        selectedItems.has(index)
                          ? "border-purple-500 bg-purple-50 ring-2 ring-purple-500/20 dark:border-purple-400 dark:bg-purple-900/20"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                            selectedItems.has(index)
                              ? "border-purple-500 bg-purple-500 text-white"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {selectedItems.has(index) && (
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                  <p className="text-xs text-gray-400">
                    {selectedItems.size} item{selectedItems.size !== 1 ? "s" : ""} selected
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerate}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      Regenerate
                    </button>
                    <button
                      onClick={handleAssign}
                      disabled={selectedItems.size === 0}
                      className="rounded-lg bg-purple-500 px-3 py-1.5 text-sm text-white hover:bg-purple-600 disabled:opacity-50"
                    >
                      Assign Selected
                    </button>
                  </div>
                </div>

                <p className="text-center text-xs text-gray-400">
                  Powered by Coaching OS AI
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
