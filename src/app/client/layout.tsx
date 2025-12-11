"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ClientAuthProvider, useClientAuth } from "@/context/ClientAuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { getInitials } from "@/lib/utils/formatters";

function ClientHeader() {
  const { currentClient, logout } = useClientAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/client/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/client/dashboard" className="text-xl font-bold text-gray-900 dark:text-white">
            Coaching OS
          </Link>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            Client Portal
          </span>
        </div>

        {currentClient && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-medium text-white">
                {getInitials(currentClient.name)}
              </div>
              <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 sm:block">
                {currentClient.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function ClientNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/client/dashboard", label: "Dashboard" },
    { href: "/client/sessions", label: "Sessions" },
    { href: "/client/notes", label: "Notes & Homework" },
    { href: "/client/program", label: "My Program" },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex gap-4 overflow-x-auto sm:gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const { currentClient, isLoading } = useClientAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !currentClient && pathname !== "/client/login") {
      router.push("/client/login");
    }
  }, [currentClient, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Show login page without header/nav
  if (pathname === "/client/login") {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated
  if (!currentClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ClientHeader />
      <ClientNav />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

      {/* Dev mode: Link back to coach dashboard */}
      <div className="fixed bottom-4 right-4">
        <Link
          href="/dashboard"
          className="rounded-lg bg-gray-800 px-3 py-2 text-xs text-white shadow-lg hover:bg-gray-700"
        >
          Coach View
        </Link>
      </div>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ClientAuthProvider>
        <ClientLayoutContent>{children}</ClientLayoutContent>
      </ClientAuthProvider>
    </ThemeProvider>
  );
}
