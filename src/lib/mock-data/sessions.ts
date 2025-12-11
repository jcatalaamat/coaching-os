import { Session } from "@/types/entities";

// Helper to create dates relative to today
const today = new Date();
const addDays = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date;
};

export const mockSessions: Session[] = [
  // Today's sessions
  {
    id: "session-1",
    coachId: "coach-1",
    clientId: "client-1",
    programId: "program-1",
    dateTime: new Date(today.setHours(10, 0, 0, 0)),
    durationMinutes: 60,
    status: "scheduled",
    location: "Zoom",
  },
  {
    id: "session-2",
    coachId: "coach-1",
    clientId: "client-2",
    programId: "program-2",
    dateTime: new Date(today.setHours(14, 0, 0, 0)),
    durationMinutes: 45,
    status: "scheduled",
    location: "Google Meet",
  },
  // Future sessions
  {
    id: "session-3",
    coachId: "coach-1",
    clientId: "client-1",
    programId: "program-1",
    dateTime: addDays(7),
    durationMinutes: 60,
    status: "scheduled",
    location: "Zoom",
  },
  {
    id: "session-4",
    coachId: "coach-1",
    clientId: "client-4",
    programId: "program-3",
    dateTime: addDays(3),
    durationMinutes: 90,
    status: "scheduled",
    location: "In-person",
  },
  // Past sessions
  {
    id: "session-5",
    coachId: "coach-1",
    clientId: "client-1",
    programId: "program-1",
    dateTime: addDays(-7),
    durationMinutes: 60,
    status: "completed",
    location: "Zoom",
  },
  {
    id: "session-6",
    coachId: "coach-1",
    clientId: "client-2",
    programId: "program-2",
    dateTime: addDays(-14),
    durationMinutes: 45,
    status: "completed",
    location: "Google Meet",
  },
  {
    id: "session-7",
    coachId: "coach-1",
    clientId: "client-5",
    programId: "program-1",
    dateTime: addDays(-30),
    durationMinutes: 60,
    status: "cancelled",
    location: "Zoom",
  },
];
