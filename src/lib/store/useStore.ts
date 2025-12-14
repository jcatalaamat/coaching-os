"use client";

import { useState, useEffect, useCallback } from "react";
import { Client, Session, Note, Program } from "@/types/entities";
import * as store from "./index";

// Custom hook for using the store with automatic re-renders
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setClients(store.getClients());
  }, []);

  useEffect(() => {
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const addClient = useCallback(
    (client: Omit<Client, "id" | "coachId" | "createdAt">) => {
      const newClient = store.addClient(client);
      refresh();
      return newClient;
    },
    [refresh]
  );

  const updateClient = useCallback(
    (id: string, updates: Partial<Client>) => {
      const updated = store.updateClient(id, updates);
      refresh();
      return updated;
    },
    [refresh]
  );

  const deleteClient = useCallback(
    (id: string) => {
      const result = store.deleteClient(id);
      refresh();
      return result;
    },
    [refresh]
  );

  return {
    clients,
    isLoading,
    addClient,
    updateClient,
    deleteClient,
    refresh,
    getClientById: store.getClientById,
    getClientCountsByStatus: store.getClientCountsByStatus,
  };
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setSessions(store.getSessions());
  }, []);

  useEffect(() => {
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const addSession = useCallback(
    (session: Omit<Session, "id" | "coachId">) => {
      const newSession = store.addSession(session);
      refresh();
      return newSession;
    },
    [refresh]
  );

  const updateSession = useCallback(
    (id: string, updates: Partial<Session>) => {
      const updated = store.updateSession(id, updates);
      refresh();
      return updated;
    },
    [refresh]
  );

  const deleteSession = useCallback(
    (id: string) => {
      const result = store.deleteSession(id);
      refresh();
      return result;
    },
    [refresh]
  );

  return {
    sessions,
    isLoading,
    addSession,
    updateSession,
    deleteSession,
    refresh,
    getSessionById: store.getSessionById,
    getSessionsForClient: store.getSessionsForClient,
    getUpcomingSessions: store.getUpcomingSessions,
    getPastSessions: store.getPastSessions,
    getTodaySessions: store.getTodaySessions,
    getThisWeekSessions: store.getThisWeekSessions,
    getThisMonthSessions: store.getThisMonthSessions,
    getLastSessionForClient: store.getLastSessionForClient,
    getNextSessionForClient: store.getNextSessionForClient,
    filterSessionsByStatus: store.filterSessionsByStatus,
    filterSessionsByDateRange: store.filterSessionsByDateRange,
  };
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setNotes(store.getNotes());
  }, []);

  useEffect(() => {
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const addNote = useCallback(
    (note: Omit<Note, "id" | "coachId" | "createdAt">) => {
      const newNote = store.addNote(note);
      refresh();
      return newNote;
    },
    [refresh]
  );

  const updateNote = useCallback(
    (id: string, updates: Partial<Note>) => {
      const updated = store.updateNote(id, updates);
      refresh();
      return updated;
    },
    [refresh]
  );

  const deleteNote = useCallback(
    (id: string) => {
      const result = store.deleteNote(id);
      refresh();
      return result;
    },
    [refresh]
  );

  return {
    notes,
    isLoading,
    addNote,
    updateNote,
    deleteNote,
    refresh,
    getNoteById: store.getNoteById,
    getNotesForClient: store.getNotesForClient,
    getRecentNotes: store.getRecentNotes,
  };
}

export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setPrograms(store.getPrograms());
  }, []);

  useEffect(() => {
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const addProgram = useCallback(
    (program: Omit<Program, "id" | "coachId">) => {
      const newProgram = store.addProgram(program);
      refresh();
      return newProgram;
    },
    [refresh]
  );

  const updateProgram = useCallback(
    (id: string, updates: Partial<Program>) => {
      const updated = store.updateProgram(id, updates);
      refresh();
      return updated;
    },
    [refresh]
  );

  const deleteProgram = useCallback(
    (id: string) => {
      const result = store.deleteProgram(id);
      refresh();
      return result;
    },
    [refresh]
  );

  return {
    programs,
    isLoading,
    addProgram,
    updateProgram,
    deleteProgram,
    refresh,
    getProgramById: store.getProgramById,
    getClientsInProgramCount: store.getClientsInProgramCount,
  };
}

// Combined hook for dashboard and other multi-entity pages
export function useStore() {
  const clientsHook = useClients();
  const sessionsHook = useSessions();
  const notesHook = useNotes();
  const programsHook = usePrograms();

  return {
    clients: clientsHook,
    sessions: sessionsHook,
    notes: notesHook,
    programs: programsHook,
    resetToMockData: () => {
      store.resetToMockData();
      clientsHook.refresh();
      sessionsHook.refresh();
      notesHook.refresh();
      programsHook.refresh();
    },
  };
}
