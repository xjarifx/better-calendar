# Architecture

Better Calendar is a full-stack Next.js app with a PostgreSQL database and an AI layer for natural language event extraction.

## Overview

The app uses Next.js 16 with the App Router. Page routes render the UI; API routes handle data operations. Auth is managed via JWT tokens that can come from either a Bearer header or an HTTP-only cookie. The database is PostgreSQL accessed through Prisma ORM with a driver adapter. AI features go through OpenRouter API, which gives access to many LLMs.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.4 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | PostgreSQL + Prisma 7.8.0 (driver adapter) |
| Auth | bcrypt + JWT (Bearer header + cookie dual-mode) |
| AI | OpenRouter API |
| Testing | Jest + ts-jest |
| Utilities | date-fns, lucide-react, @dnd-kit/core, @base-ui/react |

## Project Layout

```
app/                  # Next.js App Router pages and API routes
  api/                # All REST API endpoints
    auth/             # register, login, logout, me, delete
    events/           # CRUD for events
    user/             # profile and settings
    ai/               # models listing and event extraction
  calendar/           # Calendar view (monthly/weekly grid)
  events/             # Event list, detail/edit, AI input
  settings/           # User settings page
  api-docs/           # Built-in API documentation UI
  login/ + register/  # Auth pages
components/           # Reusable UI components
  ui/                 # shadcn/ui primitives (button, card, dialog, etc.)
  CalendarGrid.tsx    # Calendar grid with dnd-kit drag-and-drop
  EventCard.tsx       # Event display
  EventForm.tsx       # Event creation/editing form
  ExtractedEvents.tsx # AI extraction results
  Sidebar.tsx         # Desktop sidebar nav
  MobileNav.tsx       # Mobile bottom nav
  RightPanel.tsx      # Event detail panel
  SearchModal.tsx     # Search overlay
  EmptyStatePet.tsx   # Friendly empty state
hooks/                # Custom React hooks
  use-swipe.ts        # Touch swipe handling
lib/                  # Core library code
  db.ts               # Prisma client singleton
  db-queries.ts       # All database query functions
  auth.ts             # JWT auth helpers (sync + async)
  api.ts              # Client-side fetch wrapper
  openrouter.ts       # OpenRouter AI integration
  utils.ts            # cn() utility (clsx + tailwind-merge)
prisma/               # Database schema and migrations
tests/                # Test suite
proxy.ts              # Auth middleware for page routes
```

## Key Design Decisions

- **Dual-mode auth**: API routes support both Bearer tokens and cookies. The `getAuthUser()` function checks the Authorization header first, then falls back to cookies. This lets you use the API programmatically or through the browser.
- **Async vs sync auth**: `getAuthUser()` is synchronous (just decodes the JWT). `getAuthUserAsync()` additionally verifies the token version against the database, making it suitable for sensitive operations like password changes. See `lib/auth.ts`.
- **Token versioning**: Each user has a `tokenVersion` field (default 0). Changing passwords increments it, which invalidates all existing JWTs. The async auth check catches this.
- **Driver adapter**: Prisma 7.8.0 uses `@prisma/adapter-pg` instead of a direct connection string. The client is initialized with an adapter in `lib/db.ts`. Prisma CLI uses `prisma.config.ts` for its configuration.
- **User scoping**: Every database query filters by `user_id`. Users only ever see their own events.
- **Flexible events**: Events can be all-day (no times), timed (with start/end times), or multi-day (different start and end dates). The schema uses nullable `start_time`, `end_date`, and `end_time` fields.
