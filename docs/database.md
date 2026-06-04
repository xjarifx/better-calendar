# Database

PostgreSQL database with two tables: `users` and `events`. Prisma ORM handles migrations, queries, and type generation.

## Schema

```prisma
model users {
  id             Int      @id @default(autoincrement())
  username       String   @unique @db.VarChar(255)
  password       String   @db.VarChar(255)
  apiKey         String?  @db.VarChar(255)
  timeFormat     String   @default("12h") @db.VarChar(10)
  firstDayOfWeek Int      @default(0)
  tokenVersion   Int      @default(0)
  created_at     DateTime @default(now())
  events         events[]
}

model events {
  id          Int      @id @default(autoincrement())
  user_id     Int
  title       String   @db.VarChar(255)
  start_date  DateTime
  start_time  DateTime?
  end_date    DateTime?
  end_time    DateTime?
  location    String?
  description String?
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
  users       users    @relation(fields: [user_id], references: [id], onDelete: Cascade)
}
```

## users

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| id | Int (auto-increment) | — | Primary key |
| username | VARCHAR(255) | — | Unique |
| password | VARCHAR(255) | — | bcrypt hashed |
| apiKey | VARCHAR(255)? | null | Personal OpenRouter API key |
| timeFormat | VARCHAR(10) | `"12h"` | `"12h"` or `"24h"` |
| firstDayOfWeek | Int | 0 | 0=Sunday, 1=Monday ... 6=Saturday |
| tokenVersion | Int | 0 | Incremented on password change |
| created_at | DateTime | now() | |

## events

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| id | Int (auto-increment) | — | Primary key |
| user_id | Int | — | Foreign key → users.id (cascade delete) |
| title | VARCHAR(255) | — | Required |
| start_date | DateTime | — | The calendar date. For timed events, this is the date portion |
| start_time | DateTime? | null | Full datetime if event has a specific time. Null = all-day |
| end_date | DateTime? | null | For multi-day events. Null = single day |
| end_time | DateTime? | null | Event end time |
| location | Text? | null | Free-text location |
| description | Text? | null | Free-text description |
| created_at | DateTime | now() | |
| updated_at | DateTime | auto-updated | |

## Key Behaviors

- **All-day events**: `startDate` is set, `startTime` is null.
- **Timed events**: Both `startDate` and `startTime` are set. `startDate` will be midnight of the day, `startTime` has the actual time.
- **Multi-day events**: `startDate` and `endDate` differ. Optionally timed.
- **User isolation**: All queries filter by `user_id`. No user can see another user's events.
- **Cascade delete**: Deleting a user removes all their events.

## Query Layer

All database operations live in `lib/db-queries.ts`. It exports typed functions like `createEvent`, `getEventsByUserId`, `updateEvent`, `deleteEvent`, etc. These functions handle the Prisma calls and any data transformation needed. The Prisma client is initialized once in `lib/db.ts` using the `@prisma/adapter-pg` driver adapter pattern.

## Prisma Setup

Because Prisma 7.8.0 uses a driver adapter instead of a direct connection URL, the Prisma CLI needs `prisma.config.ts` to tell it how to find the schema and database. The schema file is at `prisma/schema.prisma`.

Commands:

| Command | What it does |
|---------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to DB without a migration |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:studio` | Open Prisma Studio GUI |
