import { CalendarProvider } from "@/lib/calendar-context";
import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";
import MobileNav from "@/components/MobileNav";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CalendarProvider>
      <div className="relative min-h-screen w-full [--sidebar-width:16rem]">
        <Sidebar />
        <main className="h-screen bg-background ml-0 mr-0 md:ml-[var(--sidebar-width)] md:mr-[400px] transition-all duration-300 flex flex-col pb-16 md:pb-0">
          <div className="flex min-h-0 flex-1 flex-col">
            {children}
          </div>
        </main>
        <MobileNav />
        <RightPanel />
      </div>
    </CalendarProvider>
  );
}
