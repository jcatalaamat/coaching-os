"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Client } from "@/types/entities";
import { getClientById } from "@/lib/utils/helpers";

interface ClientAuthContextType {
  currentClient: Client | null;
  setCurrentClientId: (id: string | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [currentClientId, setCurrentClientIdState] = useState<string | null>(null);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const storedClientId = localStorage.getItem("coaching-os-client-id");
    if (storedClientId) {
      setCurrentClientIdState(storedClientId);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (currentClientId) {
      const client = getClientById(currentClientId);
      setCurrentClient(client || null);
      localStorage.setItem("coaching-os-client-id", currentClientId);
    } else {
      setCurrentClient(null);
      localStorage.removeItem("coaching-os-client-id");
    }
  }, [currentClientId]);

  const setCurrentClientId = (id: string | null) => {
    setCurrentClientIdState(id);
  };

  const logout = () => {
    setCurrentClientIdState(null);
  };

  return (
    <ClientAuthContext.Provider
      value={{ currentClient, setCurrentClientId, logout, isLoading }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider");
  }
  return context;
}
