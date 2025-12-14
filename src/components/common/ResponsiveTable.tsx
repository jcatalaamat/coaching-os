"use client";

import React from "react";

interface Column<T> {
  key: string;
  header: string;
  className?: string;
  hideOnMobile?: boolean;
  render: (item: T) => React.ReactNode;
}

interface ResponsiveTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  mobileCard?: (item: T) => React.ReactNode;
}

export function ResponsiveTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "No items found.",
  mobileCard,
}: ResponsiveTableProps<T>) {
  // Get visible columns (those not hidden on mobile)
  const visibleColumns = columns.filter((col) => !col.hideOnMobile);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Mobile Card View */}
      {mobileCard && (
        <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-800">
          {data.length > 0 ? (
            data.map((item) => (
              <div
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={onRowClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]" : ""}
              >
                {mobileCard(item)}
              </div>
            ))
          ) : (
            <div className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
              {emptyMessage}
            </div>
          )}
        </div>
      )}

      {/* Desktop Table View */}
      <div className={mobileCard ? "hidden md:block overflow-x-auto" : "overflow-x-auto"}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 ${
                    col.hideOnMobile ? "hidden md:table-cell" : ""
                  } ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={() => onRowClick?.(item)}
                  className={onRowClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]" : ""}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-6 py-4 ${col.hideOnMobile ? "hidden md:table-cell" : ""} ${col.className || ""}`}
                    >
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
