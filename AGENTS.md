# Better Calendar - AI Agent Guide

## Project Overview
Better Calendar is an AI-powered calendar application built with Next.js 16.2.4 (App Router), TypeScript, Tailwind CSS, PostgreSQL with Prisma ORM, and OpenRouter AI integration.

## Tech Stack
- **Framework**: Next.js 16.2.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM 7.8.0
- **Auth**: Username/password with bcrypt + JWT
- **AI**: OpenRouter API

## Project Structure
```
better-calender/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts      # POST - User login
│   │   │   └── register/route.ts   # POST - User registration
│   │   └── events/
│   │       ├── route.ts            # GET (list), POST (create)
│   │       └── [id]/route.ts      # GET, PUT, DELETE single event
│   ├── layout.tsx                 # Root layout with metadata
│   └── globals.css                # Global styles
├── lib/
│   ├── db.ts                      # Prisma client singleton
│   ├── db-queries.ts              # Database query functions
│   └── auth.ts                    # JWT authentication helper
├── prisma/
│   ├── schema.prisma              # Database schema (User, Event models)
│   └── migrations/                # Database migrations
├── docs/                          # Project documentation
│   ├── DATABASE.md                # Database schema details
│   ├── TECH_STACK.md              # Technology stack
│   ├── PROJECT_SCOPE.md           # MVP scope
│   ├── UI_UX_FLOW.md              # UI/UX flow
│   └── FAQ.md                     # FAQ
├── .env.example                   # Environment variables template
├── prisma.config.ts               # Prisma CLI configuration
└── package.json
```

## Database Schema

### User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique @db.VarChar(255)
  password  String   @db.VarChar(255)
  createdAt DateTime @default(now()) @map("created_at")
  events    Event[]
  @@map("users")
}
```

### Event Model
```prisma
model Event {
  id          Int      @id @default(autoincrement())
  userId      Int      @map("user_id")
  title       String   @db.VarChar(255)
  startDate   DateTime @map("start_date")
  startTime   DateTime? @map("start_time")
  endDate     DateTime? @map("end_date")
  endTime     DateTime? @map("end_time")
  location    String?   @db.Text
  description String?   @db.Text
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("events")
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  - Body: `{ "username": "string", "password": "string" }`
  - Returns: `{ id, username, token }`

- `POST /api/auth/login` - Login user
  - Body: `{ "username": "string", "password": "string" }`
  - Returns: `{ id, username, token }`

### Events (requires Authorization header: `Bearer <token>`)
- `GET /api/events` - List all events for authenticated user
- `POST /api/events` - Create new event
  - Body: `{ "title": "string", "startDate": "ISO date", "startTime?": "ISO datetime", "endDate?": "ISO date", "endTime?": "ISO datetime", "location?": "string", "description?": "string" }`
- `GET /api/events/[id]` - Get single event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

## Environment Variables (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/better_calendar"
JWT_SECRET="your-jwt-secret-key"
OPENROUTER_API_KEY="sk-or-v1-..."
```

## Common Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev --name <name>` - Run database migrations
- `npx prisma studio` - Open Prisma Studio

## Important Notes
- **Next.js Version**: This uses Next.js 16.2.4 which may have breaking changes from your training data. Check `node_modules/next/dist/docs/` if unsure.
- **Prisma Version**: Uses Prisma 7.8.0 with driver adapters. The client requires either an `adapter` or `accelerateUrl` in constructor.
- **Authentication**: JWT tokens are passed via Authorization header (Bearer scheme).
- **Database**: Each user only sees their own events (userId filtering in all queries).
- **Date Handling**: Events support all-day events (no time) or timed events with start/end times.

## Development Workflow
1. Copy `.env.example` to `.env` and configure DATABASE_URL, JWT_SECRET
2. Run `npx prisma migrate dev --name init` to create database tables
3. Run `npm run dev` to start development server
4. API routes are in `app/api/` using Next.js route handlers
5. Database queries are in `lib/db-queries.ts`
6. Auth middleware is in `lib/auth.ts`

