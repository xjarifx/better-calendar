# Mobile Responsiveness Plan

## Design Principles

- **Desktop: unchanged** — current 3-panel layout, styling, and behavior remain exactly as-is
- **Mobile: inspired by desktop** — same dark theme (OKLCH color tokens), same typography (Inter), same rounded-card aesthetic — just re-arranged for a phone screen
- **No video game on mobile** — EmptyStatePet (asteroid shooter) is desktop-only; replaced with a simple text empty state

---

## 1. Bottom Navigation Bar (replaces Sidebar)

**Files:** `components/Sidebar.tsx`, `app/layout.tsx`

| Screen | Behavior |
|--------|----------|
| Desktop (`md:`) | Sidebar unchanged — fixed left, `w-64`, nav links + user avatar + logout |
| Mobile (`<md:`) | Sidebar renders as a fixed bottom nav bar (`h-16`) with icon + label tabs |

- Tabs: Calendar, AI Input, Events, Settings
- Active state via same `usePathname()` logic
- Layout removes `ml-[var(--sidebar-width)]` margin on mobile so main content is full-width
- `pb-[env(safe-area-inset-bottom)]` for notched phones

---

## 2. Right Panel becomes Bottom Sheet

**Files:** `components/RightPanel.tsx`, `app/layout.tsx`, `app/globals.css`

| Screen | Behavior |
|--------|----------|
| Desktop (`md:`) | Right panel unchanged — fixed right, `w-[400px]`, 4 modes (empty/game, day-view, event-details, extracted-events) |
| Mobile (`<md:`) | Right panel content renders as a slide-up bottom sheet triggered by selecting a day or event |

Bottom sheet behavior:
- **Collapsed**: shows a small peek bar with selected date or event title
- **Expanded**: slides up to ~70% of screen height; user can drag handle to resize
- **Dismiss**: drag down past threshold, or tap backdrop
- Modes carried over: "day-view" (events list), "event-details" (edit form), "extracted-events"
- Empty mode on mobile: simple centered text — "Select a day to view events"
- Layout removes `mr-[400px]` margin on mobile

---

## 3. Compact Calendar Grid with Swipe Gestures

**Files:** `components/CalendarGrid.tsx`, `hooks/use-swipe.ts`

| Screen | Behavior |
|--------|----------|
| Desktop (`md:`) | Grid unchanged — `min-h-[140px]` cells, event bars with title + time, drag-and-drop |
| Mobile (`<md:`) | Same 7-column grid but compact — `min-h-[40px]` cells, events as colored dots (no text bars), smaller day numbers, smaller "today" circle |

Swipe navigation:
- Wire up existing `use-swipe` hook to the grid container
- **Left swipe** → next month
- **Right swipe** → previous month
- Subtle slide animation during transition

Tap behavior:
- Tapping a day cell on mobile opens the bottom sheet in "day-view" mode
- Tapping an event dot opens bottom sheet in "event-details" mode

---

## 4. Mobile Empty State (replaces EmptyStatePet)

**Files:** `components/RightPanel.tsx`

| Screen | Behavior |
|--------|----------|
| Desktop (`md:`) | EmptyStatePet (asteroid game canvas) — **unchanged** |
| Mobile (`<md:`) | Simple text empty state: "Select a day to view events" with a subtle "+" add-event button |

---

## 5. Files to Modify

| File | Changes |
|------|---------|
| `app/layout.tsx` | Add responsive margins; conditionally switch Sidebar variant; hide desktop right panel on mobile |
| `app/globals.css` | Add bottom sheet animation keyframes; safe-area inset CSS variables |
| `components/Sidebar.tsx` | Add bottom nav variant for `<md:` breakpoint |
| `components/CalendarGrid.tsx` | Compact mobile grid layout; integrate `use-swipe` for month navigation |
| `components/RightPanel.tsx` | Wrap in bottom sheet container on mobile; simple empty state instead of game |
| `hooks/use-swipe.ts` | Minor adjustments to support month navigation |

---

## 6. What Stays Unchanged

- All desktop-specific CSS and layout in existing components
- EmptyStatePet game logic (only hidden on mobile via conditional render)
- API layer, auth, data fetching, database queries
- EventForm, EventCard, SearchModal, OnboardingTour — reused as-is
- Dark theme color tokens, font family, border radii, spacing scale
- CalendarGrid drag-and-drop (`@dnd-kit/core`) — desktop only
