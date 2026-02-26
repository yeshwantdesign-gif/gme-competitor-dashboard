"use client";

import { usePathname } from "next/navigation";
import { Menu, RefreshCw, Sun, Moon } from "lucide-react";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/providers/theme-provider";
import { useT } from "@/lib/i18n";

interface TopbarProps {
  onToggleSidebar: () => void;
}

const pageTitleKeys: Record<string, string> = {
  "/overview": "page.overview",
  "/reviews": "page.reviews",
  "/news": "page.news",
  "/rankings": "page.rankings",
  "/updates": "page.updates",
};

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const pathname = usePathname();
  const { isDark, setTheme } = useTheme();
  const { t, locale, toggleLocale } = useT();

  const getPageTitle = useCallback(() => {
    if (pageTitleKeys[pathname]) return t(pageTitleKeys[pathname]);
    for (const [path, key] of Object.entries(pageTitleKeys)) {
      if (pathname.startsWith(path)) return t(key);
    }
    return t("page.dashboard");
  }, [pathname, t]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <h1 className="text-xl font-semibold text-foreground">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleLocale} title={locale === 'en' ? 'Switch to Korean' : 'Switch to English'}>
          <span className="text-sm font-semibold">{locale === 'en' ? '한' : 'EN'}</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">{t('shared.refresh')}</span>
        </Button>
      </div>
    </header>
  );
}
