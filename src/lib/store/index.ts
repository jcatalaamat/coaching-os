// localStorage-based data store for coaching OS
// Provides persistence for demo/MVP without a backend

import { Client, Session, Note, Program, SessionTemplate } from "@/types/entities";
import { mockClients } from "@/lib/mock-data/clients";
import { mockSessions } from "@/lib/mock-data/sessions";
import { mockNotes } from "@/lib/mock-data/notes";
import { mockPrograms } from "@/lib/mock-data/programs";
import { mockSessionTemplates } from "@/lib/mock-data/session-templates";

const STORAGE_KEYS = {
  clients: "coaching-os-clients",
  sessions: "coaching-os-sessions",
  notes: "coaching-os-notes",
  programs: "coaching-os-programs",
  sessionTemplates: "coaching-os-session-templates",
} as const;

// Helper to safely parse JSON from localStorage
function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;

    const parsed = JSON.parse(stored);

    // Convert date strings back to Date objects
    if (Array.isArray(parsed)) {
      return parsed.map((item) => {
        if (item.createdAt) item.createdAt = new Date(item.createdAt);
        if (item.dateTime) item.dateTime = new Date(item.dateTime);
        if (item.dueDate) item.dueDate = new Date(item.dueDate);
        return item;
      }) as T;
    }

    return parsed;
  } catch {
    return fallback;
  }
}

// Helper to save to localStorage
function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Generate a simple unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============ CLIENTS ============

export function getClients(): Client[] {
  return getFromStorage<Client[]>(STORAGE_KEYS.clients, mockClients);
}

export function getClientById(id: string): Client | undefined {
  return getClients().find((c) => c.id === id);
}

export function addClient(client: Omit<Client, "id" | "coachId" | "createdAt">): Client {
  const clients = getClients();
  const newClient: Client = {
    ...client,
    id: generateId(),
    coachId: "coach-1",
    createdAt: new Date(),
  };
  clients.push(newClient);
  saveToStorage(STORAGE_KEYS.clients, clients);
  return newClient;
}

export function updateClient(id: string, updates: Partial<Client>): Client | undefined {
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  clients[index] = { ...clients[index], ...updates };
  saveToStorage(STORAGE_KEYS.clients, clients);
  return clients[index];
}

export function deleteClient(id: string): boolean {
  const clients = getClients();
  const filtered = clients.filter((c) => c.id !== id);
  if (filtered.length === clients.length) return false;

  saveToStorage(STORAGE_KEYS.clients, filtered);
  return true;
}

// ============ SESSIONS ============

export function getSessions(): Session[] {
  return getFromStorage<Session[]>(STORAGE_KEYS.sessions, mockSessions);
}

export function getSessionById(id: string): Session | undefined {
  return getSessions().find((s) => s.id === id);
}

export function getSessionsForClient(clientId: string): Session[] {
  return getSessions().filter((s) => s.clientId === clientId);
}

export function addSession(session: Omit<Session, "id" | "coachId">): Session {
  const sessions = getSessions();
  const newSession: Session = {
    ...session,
    id: generateId(),
    coachId: "coach-1",
  };
  sessions.push(newSession);
  saveToStorage(STORAGE_KEYS.sessions, sessions);
  return newSession;
}

export function updateSession(id: string, updates: Partial<Session>): Session | undefined {
  const sessions = getSessions();
  const index = sessions.findIndex((s) => s.id === id);
  if (index === -1) return undefined;

  sessions[index] = { ...sessions[index], ...updates };
  saveToStorage(STORAGE_KEYS.sessions, sessions);
  return sessions[index];
}

export function deleteSession(id: string): boolean {
  const sessions = getSessions();
  const filtered = sessions.filter((s) => s.id !== id);
  if (filtered.length === sessions.length) return false;

  saveToStorage(STORAGE_KEYS.sessions, filtered);
  return true;
}

// ============ NOTES ============

export function getNotes(): Note[] {
  return getFromStorage<Note[]>(STORAGE_KEYS.notes, mockNotes);
}

export function getNoteById(id: string): Note | undefined {
  return getNotes().find((n) => n.id === id);
}

export function getNotesForClient(clientId: string): Note[] {
  return getNotes()
    .filter((n) => n.clientId === clientId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getNotesForSession(sessionId: string): Note[] {
  return getNotes()
    .filter((n) => n.sessionId === sessionId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function addNote(note: Omit<Note, "id" | "coachId" | "createdAt">): Note {
  const notes = getNotes();
  const newNote: Note = {
    ...note,
    id: generateId(),
    coachId: "coach-1",
    createdAt: new Date(),
  };
  notes.push(newNote);
  saveToStorage(STORAGE_KEYS.notes, notes);
  return newNote;
}

export function updateNote(id: string, updates: Partial<Note>): Note | undefined {
  const notes = getNotes();
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return undefined;

  notes[index] = { ...notes[index], ...updates };
  saveToStorage(STORAGE_KEYS.notes, notes);
  return notes[index];
}

export function deleteNote(id: string): boolean {
  const notes = getNotes();
  const filtered = notes.filter((n) => n.id !== id);
  if (filtered.length === notes.length) return false;

  saveToStorage(STORAGE_KEYS.notes, filtered);
  return true;
}

// ============ PROGRAMS ============

export function getPrograms(): Program[] {
  return getFromStorage<Program[]>(STORAGE_KEYS.programs, mockPrograms);
}

export function getProgramById(id: string): Program | undefined {
  return getPrograms().find((p) => p.id === id);
}

export function addProgram(program: Omit<Program, "id" | "coachId">): Program {
  const programs = getPrograms();
  const newProgram: Program = {
    ...program,
    id: generateId(),
    coachId: "coach-1",
  };
  programs.push(newProgram);
  saveToStorage(STORAGE_KEYS.programs, programs);
  return newProgram;
}

export function updateProgram(id: string, updates: Partial<Program>): Program | undefined {
  const programs = getPrograms();
  const index = programs.findIndex((p) => p.id === id);
  if (index === -1) return undefined;

  programs[index] = { ...programs[index], ...updates };
  saveToStorage(STORAGE_KEYS.programs, programs);
  return programs[index];
}

export function deleteProgram(id: string): boolean {
  const programs = getPrograms();
  const filtered = programs.filter((p) => p.id !== id);
  if (filtered.length === programs.length) return false;

  saveToStorage(STORAGE_KEYS.programs, filtered);
  return true;
}

// ============ UTILITY FUNCTIONS ============

export function resetToMockData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.clients);
  localStorage.removeItem(STORAGE_KEYS.sessions);
  localStorage.removeItem(STORAGE_KEYS.notes);
  localStorage.removeItem(STORAGE_KEYS.programs);
}

// Helper functions that work with the store
export function getClientCountsByStatus(): Record<string, number> {
  const clients = getClients();
  return clients.reduce((acc, client) => {
    acc[client.status] = (acc[client.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function getClientsInProgramCount(programId: string): number {
  const sessions = getSessions();
  const clientIds = new Set(
    sessions.filter((s) => s.programId === programId).map((s) => s.clientId)
  );
  return clientIds.size;
}

export function getLastSessionForClient(clientId: string): Session | undefined {
  const now = new Date();
  return getSessions()
    .filter((s) => s.clientId === clientId && s.dateTime < now)
    .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime())[0];
}

export function getNextSessionForClient(clientId: string): Session | undefined {
  const now = new Date();
  return getSessions()
    .filter((s) => s.clientId === clientId && s.dateTime >= now && s.status === "scheduled")
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())[0];
}

export function getUpcomingSessions(clientId?: string): Session[] {
  const now = new Date();
  let sessions = getSessions().filter(
    (s) => s.dateTime >= now && s.status === "scheduled"
  );
  if (clientId) {
    sessions = sessions.filter((s) => s.clientId === clientId);
  }
  return sessions.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
}

export function getPastSessions(clientId?: string): Session[] {
  const now = new Date();
  let sessions = getSessions().filter((s) => s.dateTime < now);
  if (clientId) {
    sessions = sessions.filter((s) => s.clientId === clientId);
  }
  return sessions.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
}

export function getTodaySessions(): Session[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getSessions()
    .filter((s) => s.dateTime >= today && s.dateTime < tomorrow)
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
}

export function getThisWeekSessions(): Session[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  return getSessions()
    .filter((s) => s.dateTime >= today && s.dateTime < endOfWeek)
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
}

export function getThisMonthSessions(): Session[] {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

  return getSessions()
    .filter((s) => s.dateTime >= startOfMonth && s.dateTime <= endOfMonth)
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
}

export function getActiveClientsCount(): number {
  return getClients().filter((c) => c.status === "active").length;
}

export function getRecentNotes(limit: number = 5): Note[] {
  return getNotes()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

export function filterSessionsByStatus(sessions: Session[], status: string): Session[] {
  return sessions.filter((s) => s.status === status);
}

export function filterSessionsByDateRange(sessions: Session[], range: string): Session[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (range) {
    case "today": {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return sessions.filter((s) => s.dateTime >= today && s.dateTime < tomorrow);
    }
    case "week": {
      const endOfWeek = new Date(today);
      endOfWeek.setDate(endOfWeek.getDate() + 7);
      return sessions.filter((s) => s.dateTime >= today && s.dateTime < endOfWeek);
    }
    case "month": {
      const endOfMonth = new Date(today);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      return sessions.filter((s) => s.dateTime >= today && s.dateTime < endOfMonth);
    }
    default:
      return sessions;
  }
}

// ============ SESSION TEMPLATES ============

export function getSessionTemplates(): SessionTemplate[] {
  return getFromStorage<SessionTemplate[]>(STORAGE_KEYS.sessionTemplates, mockSessionTemplates);
}

export function getSessionTemplateById(id: string): SessionTemplate | undefined {
  return getSessionTemplates().find((t) => t.id === id);
}

export function addSessionTemplate(template: Omit<SessionTemplate, "id" | "coachId">): SessionTemplate {
  const templates = getSessionTemplates();
  const newTemplate: SessionTemplate = {
    ...template,
    id: generateId(),
    coachId: "coach-1",
  };
  templates.push(newTemplate);
  saveToStorage(STORAGE_KEYS.sessionTemplates, templates);
  return newTemplate;
}

export function updateSessionTemplate(id: string, updates: Partial<SessionTemplate>): SessionTemplate | undefined {
  const templates = getSessionTemplates();
  const index = templates.findIndex((t) => t.id === id);
  if (index === -1) return undefined;

  templates[index] = { ...templates[index], ...updates };
  saveToStorage(STORAGE_KEYS.sessionTemplates, templates);
  return templates[index];
}

export function deleteSessionTemplate(id: string): boolean {
  const templates = getSessionTemplates();
  const filtered = templates.filter((t) => t.id !== id);
  if (filtered.length === templates.length) return false;

  saveToStorage(STORAGE_KEYS.sessionTemplates, filtered);
  return true;
}
