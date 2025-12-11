import React from "react";
import { ClientStatus, SessionStatus } from "@/types/entities";

type StatusType = ClientStatus | SessionStatus;

interface StatusBadgeProps {
  status: StatusType;
}

const statusStyles: Record<StatusType, { bg: string; text: string }> = {
  // Client statuses
  active: {
    bg: "bg-green-100 dark:bg-green-500/15",
    text: "text-green-600 dark:text-green-400",
  },
  paused: {
    bg: "bg-yellow-100 dark:bg-yellow-500/15",
    text: "text-yellow-600 dark:text-yellow-400",
  },
  completed: {
    bg: "bg-blue-100 dark:bg-blue-500/15",
    text: "text-blue-600 dark:text-blue-400",
  },
  lead: {
    bg: "bg-purple-100 dark:bg-purple-500/15",
    text: "text-purple-600 dark:text-purple-400",
  },
  // Session statuses
  scheduled: {
    bg: "bg-blue-100 dark:bg-blue-500/15",
    text: "text-blue-600 dark:text-blue-400",
  },
  cancelled: {
    bg: "bg-red-100 dark:bg-red-500/15",
    text: "text-red-600 dark:text-red-400",
  },
};

const statusLabels: Record<StatusType, string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  lead: "Lead",
  scheduled: "Scheduled",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status];
  const label = statusLabels[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}
    >
      {label}
    </span>
  );
}
