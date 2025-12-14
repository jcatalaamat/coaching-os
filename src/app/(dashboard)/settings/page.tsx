"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import Button from "@/components/ui/button/Button";
import { useStore } from "@/lib/store/useStore";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const [name, setName] = useState("Coach Demo");
  const [email, setEmail] = useState("coach@example.com");
  const [timezone, setTimezone] = useState("America/New_York");
  const [defaultDuration, setDefaultDuration] = useState("60");
  const [defaultLocation, setDefaultLocation] = useState("Zoom");

  const { theme, toggleTheme } = useTheme();
  const store = useStore();

  const handleExportClients = () => {
    const clients = store.clients.clients;
    const csv = [
      ["Name", "Email", "Phone", "Status", "Tags", "Created At"].join(","),
      ...clients.map((c) =>
        [
          `"${c.name}"`,
          `"${c.email || ""}"`,
          `"${c.phone || ""}"`,
          c.status,
          `"${c.tags.join("; ")}"`,
          c.createdAt.toISOString(),
        ].join(",")
      ),
    ].join("\n");

    downloadCSV(csv, "clients.csv");
  };

  const handleExportSessions = () => {
    const sessions = store.sessions.sessions;
    const csv = [
      ["Date", "Time", "Client ID", "Program ID", "Duration", "Status", "Location"].join(","),
      ...sessions.map((s) =>
        [
          s.dateTime.toLocaleDateString(),
          s.dateTime.toLocaleTimeString(),
          s.clientId,
          s.programId || "",
          s.durationMinutes,
          s.status,
          `"${s.location}"`,
        ].join(",")
      ),
    ].join("\n");

    downloadCSV(csv, "sessions.csv");
  };

  const handleExportNotes = () => {
    const notes = store.notes.notes;
    const csv = [
      ["Title", "Content", "Client ID", "Session ID", "Created At"].join(","),
      ...notes.map((n) =>
        [
          `"${n.title || ""}"`,
          `"${n.content.replace(/"/g, '""')}"`,
          n.clientId,
          n.sessionId || "",
          n.createdAt.toISOString(),
        ].join(",")
      ),
    ].join("\n");

    downloadCSV(csv, "notes.csv");
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all data to demo defaults? This cannot be undone.")) {
      store.resetToMockData();
      alert("Data has been reset to demo defaults.");
    }
  };

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Profile Information
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="timezone"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Timezone
              </label>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full max-w-md rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (US & Canada)</option>
                <option value="America/Chicago">Central Time (US & Canada)</option>
                <option value="America/Denver">Mountain Time (US & Canada)</option>
                <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Appearance
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toggle between light and dark theme
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === "dark" ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === "dark" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Session Defaults */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Session Defaults
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="defaultDuration"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Default Duration
              </label>
              <select
                id="defaultDuration"
                value={defaultDuration}
                onChange={(e) => setDefaultDuration(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="defaultLocation"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Default Location
              </label>
              <select
                id="defaultLocation"
                value={defaultLocation}
                onChange={(e) => setDefaultLocation(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90"
              >
                <option value="Zoom">Zoom</option>
                <option value="Google Meet">Google Meet</option>
                <option value="Phone">Phone Call</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Data Export
          </h2>

          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Export your data as CSV files for backup or use in other applications.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={handleExportClients}>
              Export Clients
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportSessions}>
              Export Sessions
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportNotes}>
              Export Notes
            </Button>
          </div>
        </div>

        {/* Data Management */}
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/10">
          <h2 className="mb-4 text-lg font-semibold text-red-900 dark:text-red-100">
            Danger Zone
          </h2>

          <p className="mb-4 text-sm text-red-700 dark:text-red-300">
            Reset all data to the demo defaults. This will delete all your clients, sessions, notes, and programs.
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetData}
            className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Reset to Demo Data
          </Button>
        </div>
      </div>
    </>
  );
}
