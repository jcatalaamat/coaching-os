import { SessionTemplate } from "@/types/entities";

export const mockSessionTemplates: SessionTemplate[] = [
  {
    id: "template-1",
    coachId: "coach-1",
    name: "Standard 1:1 Session",
    durationMinutes: 60,
    location: "Zoom",
  },
  {
    id: "template-2",
    coachId: "coach-1",
    name: "Discovery Call",
    durationMinutes: 30,
    location: "Zoom",
  },
  {
    id: "template-3",
    coachId: "coach-1",
    name: "Extended Deep Dive",
    durationMinutes: 90,
    location: "Zoom",
  },
  {
    id: "template-4",
    coachId: "coach-1",
    name: "In-Person Session",
    durationMinutes: 60,
    location: "In-Person",
  },
];
