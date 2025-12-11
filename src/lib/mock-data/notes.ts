import { Note } from "@/types/entities";

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const mockNotes: Note[] = [
  {
    id: "note-1",
    coachId: "coach-1",
    clientId: "client-1",
    sessionId: "session-5",
    title: "Leadership Assessment Review",
    content: "Discussed results from 360-degree feedback. Key areas for development: delegation and strategic communication. Sarah showed strong self-awareness and openness to feedback.",
    createdAt: daysAgo(7),
  },
  {
    id: "note-2",
    coachId: "coach-1",
    clientId: "client-1",
    sessionId: undefined,
    title: "Goal Setting Session",
    content: "Established Q1 goals: 1) Improve team delegation by 50%, 2) Lead two strategic initiatives, 3) Develop executive presence in board meetings.",
    createdAt: daysAgo(14),
  },
  {
    id: "note-3",
    coachId: "coach-1",
    clientId: "client-2",
    sessionId: "session-6",
    title: "Career Exploration",
    content: "Michael explored three potential career paths. Most excited about product management role. Action item: informational interviews with 3 PMs this month.",
    createdAt: daysAgo(14),
  },
  {
    id: "note-4",
    coachId: "coach-1",
    clientId: "client-5",
    sessionId: undefined,
    title: "Program Completion",
    content: "Jessica successfully completed the 12-week executive coaching program. Achieved all major goals including promotion to VP level. Scheduled follow-up in 3 months.",
    createdAt: daysAgo(60),
  },
  {
    id: "note-5",
    coachId: "coach-1",
    clientId: "client-4",
    sessionId: undefined,
    title: "Pause Discussion",
    content: "David requested to pause coaching due to work travel schedule. Agreed to resume in January. Will check in monthly via email.",
    createdAt: daysAgo(30),
  },
];
