"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { LanguageProvider } from "@/lib/i18n";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main content area offset by sidebar width on large screens */}
          <div className="lg:pl-64">
            <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

            <main className="p-6">{children}</main>
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
