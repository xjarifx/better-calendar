"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Calendar, List, Sparkles, Settings } from "lucide-react";

const navItems = [
  { label: "Calendar", icon: Calendar, href: "/calendar" },
  { label: "AI Input", icon: Sparkles, href: "/events/input" },
  { label: "Events", icon: List, href: "/events" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function MobileNav() {
  const { isAuthenticated } = useAuth();
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

  return (
    <nav className="flex h-16 items-center border-t border-border bg-background px-2 md:hidden">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[11px] transition-colors",
            isActive(item.href)
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-label={item.label}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
