"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClientAuth } from "@/context/ClientAuthContext";
import { mockClients } from "@/lib/mock-data/clients";
import Button from "@/components/ui/button/Button";
import { getInitials } from "@/lib/utils/formatters";

export default function ClientLoginPage() {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const { setCurrentClientId } = useClientAuth();
  const router = useRouter();

  const handleLogin = () => {
    if (selectedClientId) {
      setCurrentClientId(selectedClientId);
      router.push("/client/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Coaching OS
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Client Portal
          </p>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Your Account
          </label>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
            Demo Mode: Choose a client to preview the portal
          </p>

          <div className="space-y-2">
            {mockClients.map((client) => (
              <button
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
                className={`w-full rounded-lg border p-3 text-left transition-all ${
                  selectedClientId === client.id
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 dark:border-blue-400 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-700/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-white ${
                    selectedClientId === client.id
                      ? "bg-gradient-to-br from-blue-500 to-purple-600"
                      : "bg-gray-400 dark:bg-gray-600"
                  }`}>
                    {getInitials(client.name)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {client.name}
                    </p>
                    {client.email && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {client.email}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleLogin}
          disabled={!selectedClientId}
          className="w-full"
        >
          Sign In
        </Button>

        <div className="mt-6 text-center">
          <a
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Back to Coach Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
