"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import CalendarGrid from "@/components/CalendarGrid";
import { useAuth } from "@/lib/auth-context";

export default function CalendarPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) return null;

  return <CalendarGrid />;
}
