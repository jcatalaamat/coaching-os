import { Homework } from "@/types/entities";

// Mock homework data for demo
export const mockHomework: Homework[] = [
  {
    id: "hw-1",
    clientId: "client-1",
    sessionId: "session-1",
    title: "Daily journaling practice",
    description: "Spend 10 minutes each morning writing about your goals and intentions for the day.",
    completed: true,
    dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
  },
  {
    id: "hw-2",
    clientId: "client-1",
    sessionId: "session-1",
    title: "Practice boundary-setting",
    description: "Identify one situation this week where you can practice saying no or setting a healthy boundary.",
    completed: true,
    dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: "hw-3",
    clientId: "client-1",
    title: "Complete self-assessment worksheet",
    description: "Fill out the provided self-assessment form and bring it to our next session for discussion.",
    completed: false,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "hw-4",
    clientId: "client-1",
    title: "Schedule self-care activity",
    description: "Block 2 hours in your calendar for an activity that brings you joy and relaxation.",
    completed: false,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "hw-5",
    clientId: "client-2",
    sessionId: "session-3",
    title: "Track energy levels",
    description: "Note your energy at 3 points during each day for one week: morning, afternoon, and evening.",
    completed: false,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "hw-6",
    clientId: "client-2",
    title: "Read assigned chapter",
    description: "Complete reading Chapter 5 of 'Atomic Habits' and note 3 key takeaways.",
    completed: true,
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: "hw-7",
    clientId: "client-3",
    title: "Morning routine experiment",
    description: "Try the new morning routine for 5 consecutive days and report your results.",
    completed: false,
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "hw-8",
    clientId: "client-4",
    title: "Networking outreach",
    description: "Reach out to 2 people in your target network for coffee chats or virtual meetings.",
    completed: false,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

// Helper function to get homework for a specific client
export function getHomeworkForClient(clientId: string): Homework[] {
  return mockHomework.filter((hw) => hw.clientId === clientId);
}

// Helper function to get pending homework for a client
export function getPendingHomework(clientId: string): Homework[] {
  return mockHomework.filter((hw) => hw.clientId === clientId && !hw.completed);
}

// Helper function to get completed homework for a client
export function getCompletedHomework(clientId: string): Homework[] {
  return mockHomework.filter((hw) => hw.clientId === clientId && hw.completed);
}
