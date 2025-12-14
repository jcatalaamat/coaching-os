"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import Button from "@/components/ui/button/Button";
import { AddClientModal } from "@/components/clients/AddClientModal";
import { EditClientModal } from "@/components/clients/EditClientModal";
import { useModal } from "@/hooks/useModal";
import { useClients, useSessions } from "@/lib/store/useStore";
import { useToast } from "@/context/ToastContext";
import { Client } from "@/types/entities";
import {
  formatDate,
  formatRelativeTime,
  getInitials,
} from "@/lib/utils/formatters";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { isOpen: isAddModalOpen, openModal: openAddModal, closeModal: closeAddModal } = useModal();
  const { isOpen: isEditModalOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();

  const { showToast } = useToast();
  const { clients, addClient, updateClient, deleteClient, getClientCountsByStatus } = useClients();
  const { getLastSessionForClient, getNextSessionForClient } = useSessions();

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [searchQuery, clients]);

  const statusCounts = getClientCountsByStatus();

  const handleDeleteClient = (client: Client) => {
    if (confirm(`Are you sure you want to delete "${client.name}"? This will also delete all their sessions and notes. This cannot be undone.`)) {
      deleteClient(client.id);
      showToast("Client deleted", "info");
    }
  };

  return (
    <>
      <PageHeader
        title="Clients"
        description="Manage your coaching clients"
        actions={
          <Button size="sm" onClick={openAddModal}>
            Add Client
          </Button>
        }
      />

      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={(clientData) => {
          addClient(clientData);
          showToast("Client added successfully");
        }}
      />

      <EditClientModal
        isOpen={isEditModalOpen}
        onClose={() => {
          closeEditModal();
          setEditingClient(null);
        }}
        client={editingClient}
        onSave={(clientData) => {
          updateClient(clientData.id, clientData);
          showToast("Client updated successfully");
        }}
      />

      {/* Stats Summary */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Total: <strong className="text-gray-900 dark:text-white">{clients.length}</strong>
        </span>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <span className="text-green-600 dark:text-green-400">
          Active: <strong>{statusCounts.active || 0}</strong>
        </span>
        <span className="text-yellow-600 dark:text-yellow-400">
          Paused: <strong>{statusCounts.paused || 0}</strong>
        </span>
        <span className="text-purple-600 dark:text-purple-400">
          Leads: <strong>{statusCounts.lead || 0}</strong>
        </span>
        <span className="text-blue-600 dark:text-blue-400">
          Completed: <strong>{statusCounts.completed || 0}</strong>
        </span>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search clients by name, email, or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30"
        />
      </div>

      {/* Clients Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Tags
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Last Session
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Next Session
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => {
                  const lastSession = getLastSessionForClient(client.id);
                  const nextSession = getNextSessionForClient(client.id);

                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/clients/${client.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {getInitials(client.name)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                              {client.name}
                            </p>
                            {client.email && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {client.email}
                              </p>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={client.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {client.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {lastSession ? (
                          <span title={formatDate(lastSession.dateTime)}>
                            {formatRelativeTime(lastSession.dateTime)}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {nextSession ? (
                          <span className="text-gray-900 dark:text-white">
                            {formatDate(nextSession.dateTime)}
                          </span>
                        ) : (
                          <span className="text-gray-400">None scheduled</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setEditingClient(client);
                              openEditModal();
                            }}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteClient(client);
                            }}
                            className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    {searchQuery
                      ? "No clients found matching your search."
                      : "No clients yet. Add your first client to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
