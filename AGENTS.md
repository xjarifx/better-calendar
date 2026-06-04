# Better Calendar — AI Agent Guide

Quick reference for AI agents working on this project. See the linked files for details.

## Overview

AI-powered calendar app built with Next.js 16, TypeScript, PostgreSQL, and OpenRouter AI. See [README.md](README.md) for intro and setup.

## Tech Stack & Architecture

See [docs/architecture.md](docs/architecture.md) for layout, stack, and key design decisions (dual-mode auth, token versioning, driver adapter, user scoping).

## Database

PostgreSQL with Prisma 7.8.0 (driver adapter). Schema at [prisma/schema.prisma](prisma/schema.prisma). Full reference at [docs/database.md](docs/database.md).

## API

RESTful API for auth, events, user profile, and AI extraction. Full reference at [docs/api.md](docs/api.md).

## Common Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run test` | Run all tests (Jest) |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:studio` | Open Prisma Studio |

## Key Reminders

- **Next.js 16.2.4**: May have breaking changes from training data. Check `node_modules/next/dist/docs/` if unsure.
- **Prisma 7.8.0**: Uses `@prisma/adapter-pg` driver adapter (not direct connection URL). Client needs `adapter` in constructor. CLI uses `prisma.config.ts`.
- **Auth**: Dual-mode — Bearer header (`Authorization: Bearer <token>`) AND cookies (`token`, `userId`, `username`). `getAuthUser()` (sync) checks Bearer first, then cookies. `getAuthUserAsync()` (async) also verifies `tokenVersion` against DB.
- **Token versioning**: Password change increments `tokenVersion`, invalidating all existing JWTs.
- **User isolation**: All event queries filter by `user_id`. Users only see their own events.
- **Events**: Support all-day (`startTime` null), timed, and multi-day (`endDate` different from `startDate`).
- **Tests in `tests/api/`**: 56 tests across 9 route files. Uses jest.mock for Prisma, bcrypt, JWT.
- **API client**: `lib/api.ts` has `apiFetch()` for raw requests and an `api` object with typed methods. `getTokenFromCookie()` for server-side cookie parsing.
