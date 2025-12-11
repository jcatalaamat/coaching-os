/**
 * Data helper functions for working with mock data
 */

import { mockClients } from "@/lib/mock-data/clients";
import { mockSessions } from "@/lib/mock-data/sessions";
import { mockPrograms } from "@/lib/mock-data/programs";
import { mockNotes } from "@/lib/mock-data/notes";
import { Client, Session, Program, Note } from "@/types/entities";
import { isToday, isFuture, isPast, isThisWeek } from "./formatters";

/**
 * Get a client by ID
 */
export function getClientById(id: string): Client | undefined {
  return mockClients.find((client) => client.id === id);
}

/**
 * Get a program by ID
 */
export function getProgramById(id: string): Program | undefined {
  return mockPrograms.find((program) => program.id === id);
}

/**
 * Get all sessions for a specific client
 */
export function getSessionsForClient(clientId: string): Session[] {
  return mockSessions.filter((session) => session.clientId === clientId);
}

/**
 * Get all notes for a specific client
 */
export function getNotesForClient(clientId: string): Note[] {
  return mockNotes
    .filter((note) => note.clientId === clientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Get today's sessions
 */
export function getTodaySessions(): Session[] {
  return mockSessions.filter((session) => isToday(session.dateTime));
}

/**
 * Get upcoming sessions (future, sorted by date ascending)
 */
export function getUpcomingSessions(clientId?: string): Session[] {
  let sessions = mockSessions.filter(
    (session) => isFuture(session.dateTime) && session.status === "scheduled"
  );

  if (clientId) {
    sessions = sessions.filter((session) => session.clientId === clientId);
  }

  return sessions.sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );
}

/**
 * Get past sessions (completed or cancelled)
 */
export function getPastSessions(clientId?: string): Session[] {
  let sessions = mockSessions.filter((session) => isPast(session.dateTime));

  if (clientId) {
    sessions = sessions.filter((session) => session.clientId === clientId);
  }

  return sessions.sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );
}

/**
 * Get sessions for this week
 */
export function getThisWeekSessions(): Session[] {
  return mockSessions.filter((session) => isThisWeek(session.dateTime));
}

/**
 * Get the last session for a client
 */
export function getLastSessionForClient(clientId: string): Session | undefined {
  const pastSessions = mockSessions
    .filter(
      (session) =>
        session.clientId === clientId &&
        isPast(session.dateTime) &&
        session.status === "completed"
    )
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  return pastSessions[0];
}

/**
 * Get the next session for a client
 */
export function getNextSessionForClient(clientId: string): Session | undefined {
  const futureSessions = mockSessions
    .filter(
      (session) =>
        session.clientId === clientId &&
        isFuture(session.dateTime) &&
        session.status === "scheduled"
    )
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return futureSessions[0];
}

/**
 * Get recent notes (sorted by date, limit optional)
 */
export function getRecentNotes(limit?: number): Note[] {
  const sorted = [...mockNotes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Count clients by status
 */
export function getClientCountsByStatus(): Record<string, number> {
  return mockClients.reduce(
    (acc, client) => {
      acc[client.status] = (acc[client.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}

/**
 * Get count of active clients
 */
export function getActiveClientsCount(): number {
  return mockClients.filter((client) => client.status === "active").length;
}

/**
 * Get count of clients enrolled in a program
 */
export function getClientsInProgramCount(programId: string): number {
  // In a real app, this would query a enrollment/subscription table
  // For mock data, we'll count sessions with this program
  const clientIds = new Set(
    mockSessions
      .filter((session) => session.programId === programId)
      .map((session) => session.clientId)
  );
  return clientIds.size;
}

/**
 * Search clients by name (case-insensitive)
 */
export function searchClients(query: string): Client[] {
  if (!query.trim()) return mockClients;
  const lowerQuery = query.toLowerCase();
  return mockClients.filter((client) =>
    client.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter sessions by status
 */
export function filterSessionsByStatus(
  sessions: Session[],
  status: string
): Session[] {
  if (status === "all") return sessions;
  return sessions.filter((session) => session.status === status);
}

/**
 * Filter sessions by date range
 */
export function filterSessionsByDateRange(
  sessions: Session[],
  range: "all" | "today" | "week" | "month"
): Session[] {
  const now = new Date();

  switch (range) {
    case "today":
      return sessions.filter((session) => isToday(session.dateTime));
    case "week":
      return sessions.filter((session) => isThisWeek(session.dateTime));
    case "month": {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return sessions.filter((session) => {
        const d = new Date(session.dateTime);
        return d >= startOfMonth && d <= endOfMonth;
      });
    }
    default:
      return sessions;
  }
}
