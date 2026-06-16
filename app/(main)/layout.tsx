"use client";

import { CalendarProvider, useCalendar } from "@/lib/calendar-context";
import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";
import MobileNav from "@/components/MobileNav";
import { cn } from "@/lib/utils";

function MainContent({ children }: { children: React.ReactNode }) {
  const { leftSidebarCollapsed, rightSidebarCollapsed } = useCalendar();

  return (
    <div className="relative min-h-screen w-full">
      <Sidebar />
      <main
        className={cn(
          "h-screen bg-background transition-all duration-300 flex flex-col pb-16 md:pb-0",
          leftSidebarCollapsed ? "md:ml-16" : "md:ml-64",
          rightSidebarCollapsed ? "md:mr-12" : "md:mr-[400px]"
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          {children}
        </div>
      </main>
      <MobileNav />
      <RightPanel />
    </div>
  );
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CalendarProvider>
      <MainContent>{children}</MainContent>
    </CalendarProvider>
  );
}
