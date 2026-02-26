"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  RefreshCw,
  Trophy,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { labelKey: "nav.overview", href: "/overview", icon: LayoutDashboard },
  { labelKey: "nav.reviews", href: "/reviews", icon: MessageSquare },
  { labelKey: "nav.news", href: "/news", icon: Newspaper },
  { labelKey: "nav.updates", href: "/updates", icon: RefreshCw },
  { labelKey: "nav.rankings", href: "/rankings", icon: Trophy },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useT();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/overview" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                G
              </span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              {t("sidebar.title")}
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-sm p-1 text-muted-foreground hover:text-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4">
          <p className="text-xs text-muted-foreground">
            {t("sidebar.footer")}
          </p>
        </div>
      </aside>
    </>
  );
}
