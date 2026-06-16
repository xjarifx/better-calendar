"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCalendar } from "@/lib/calendar-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, List, Sparkles, Settings, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";

const navItems = [
  { label: "Calendar", icon: Calendar, href: "/calendar" },
  { label: "AI Input", icon: Sparkles, href: "/events/input" },
  { label: "Events", icon: List, href: "/events" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const { isAuthenticated, username, logout } = useAuth();
  const { leftSidebarCollapsed, setLeftSidebarCollapsed } = useCalendar();
  const pathname = usePathname();

  if (!isAuthenticated) return null;

  const matchingItems = navItems.filter(
    (item) => pathname === item.href || pathname?.startsWith(item.href + "/"),
  );
  const activeHref =
    matchingItems.length > 0
      ? matchingItems.sort((a, b) => b.href.length - a.href.length)[0].href
      : null;
  const isActive = (href: string) => href === activeHref;

  const usernameInitial = username?.charAt(0).toUpperCase() || "U";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-full flex-col border-r border-border bg-sidebar transition-all duration-300 md:flex",
        leftSidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="border-b border-border px-4 py-4 flex items-center justify-between">
        <Link
          href="/calendar"
          className="flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          <img src="/calendar.png" alt="Better Calendar" className="h-5 w-5" />
          {!leftSidebarCollapsed && <span>Better Calendar</span>}
        </Link>
        <button
          onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
          className="text-muted-foreground hover:text-foreground p-1 rounded"
          aria-label={leftSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {leftSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
              isActive(item.href)
                ? "bg-primary/15 text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              leftSidebarCollapsed && "justify-center"
            )}
            title={item.label}
            aria-label={item.label}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!leftSidebarCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-2">
        <div className={cn("mb-2 flex items-center gap-3 rounded-lg px-2 py-2", leftSidebarCollapsed && "justify-center")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
            {usernameInitial}
          </div>
          {!leftSidebarCollapsed && <span className="truncate text-sm text-foreground">{username}</span>}
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={logout}
          className={cn(
            "mb-2 h-9 justify-start gap-2 text-red-500 hover:text-red-400 hover:bg-red-500/10",
            leftSidebarCollapsed ? "w-full px-0 justify-center" : "w-full"
          )}
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
          {!leftSidebarCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
