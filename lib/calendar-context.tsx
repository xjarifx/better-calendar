"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { events as Event } from "@prisma/client";

export type RightPanelMode =
  | "ai-input"
  | "day-view"
  | "event-details"
  | "extracted-events";

interface CalendarContextType {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;
  rightPanelMode: RightPanelMode;
  setRightPanelMode: (mode: RightPanelMode) => void;
  navigateToday: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [rightPanelMode, setRightPanelMode] =
    useState<RightPanelMode>("ai-input");

  const navigateToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        selectedEvent,
        setSelectedEvent,
        rightPanelMode,
        setRightPanelMode,
        navigateToday,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }
  return context;
}
