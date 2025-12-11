import { Program } from "@/types/entities";

export const mockPrograms: Program[] = [
  {
    id: "program-1",
    coachId: "coach-1",
    name: "Executive Leadership Coaching",
    description: "12-week intensive program for senior executives focused on strategic leadership and decision-making.",
    type: "1:1",
    price: 5000,
    currency: "USD",
    numberOfSessions: 12,
  },
  {
    id: "program-2",
    coachId: "coach-1",
    name: "Career Transition Program",
    description: "8-week program helping professionals navigate career changes and find their next opportunity.",
    type: "1:1",
    price: 2500,
    currency: "USD",
    numberOfSessions: 8,
  },
  {
    id: "program-3",
    coachId: "coach-1",
    name: "Leadership Foundations Group",
    description: "6-week group coaching program for emerging leaders to build fundamental leadership skills.",
    type: "group",
    price: 800,
    currency: "USD",
    numberOfSessions: 6,
  },
  {
    id: "program-4",
    coachId: "coach-1",
    name: "Executive Presence Bootcamp",
    description: "Hybrid program combining group sessions with individual coaching for maximum impact.",
    type: "hybrid",
    price: 3500,
    currency: "USD",
    numberOfSessions: 10,
  },
];
