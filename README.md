# Better Calendar

An AI-powered calendar application built with Next.js, TypeScript, and PostgreSQL. Create, manage, and extract events using natural language processing with OpenRouter AI integration.

## Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Event Management** - Create, read, update, and delete events
- **All-Day & Timed Events** - Support for both all-day events and events with specific times
- **Multi-Day Events** - Create events that span multiple days
- **AI Event Extraction** - Extract structured event data from natural language text using AI
- **Personal API Keys** - Users can configure their own OpenRouter API keys
- **Responsive Design** - Built with Tailwind CSS for a modern, responsive UI

## Tech Stack

- **Framework**: Next.js 16.2.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM 7.8.0
- **Authentication**: Username/password with bcrypt + JWT
- **AI Integration**: OpenRouter API

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenRouter API key (for AI features)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd better-calender
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/better_calendar"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
OPENROUTER_API_KEY="sk-or-v1-..."
```

### 4. Set up the database

Run the Prisma migrations to create the database schema:

```bash
npx prisma migrate dev --name init
```

Generate the Prisma client:

```bash
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev --name <name>` - Run database migrations
- `npx prisma studio` - Open Prisma Studio (database GUI)

## Project Structure

```
better-calender/
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication endpoints (login, register, logout, me)
│   │   ├── events/            # Event CRUD endpoints
│   │   ├── user/              # User profile endpoints
│   │   └── ai/                # AI features (models, event extraction)
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── lib/
│   ├── db.ts                  # Prisma client singleton
│   ├── db-queries.ts          # Database query functions
│   ├── auth.ts                # JWT authentication helper
│   └── openrouter.ts          # OpenRouter AI integration
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── docs/                      # Documentation
│   ├── REST_API_REFERENCE.md  # Complete API documentation
│   ├── DATABASE.md            # Database schema details
│   ├── TECH_STACK.md          # Technology stack
│   └── ...                    # Other documentation
└── public/                    # Static assets
```

## API Overview

The application provides a RESTful API for authentication, event management, and AI features. For complete API documentation, see [docs/REST_API_REFERENCE.md](docs/REST_API_REFERENCE.md).

### Key Endpoints

- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- **Events**: `/api/events` (GET, POST), `/api/events/[id]` (GET, PUT, DELETE)
- **User**: `/api/user` (GET, PUT)
- **AI**: `/api/ai/models` (GET), `/api/ai/extract` (POST)

## Database Schema

### User Model
- `id` - Auto-incrementing integer (primary key)
- `username` - Unique username (VARCHAR 255)
- `password` - Hashed password (VARCHAR 255)
- `apiKey` - Optional personal OpenRouter API key
- `createdAt` - Account creation timestamp
- `events` - Relation to user's events

### Event Model
- `id` - Auto-incrementing integer (primary key)
- `userId` - Foreign key to User
- `title` - Event title (VARCHAR 255)
- `startDate` - Start date (DateTime)
- `startTime` - Optional start time (DateTime)
- `endDate` - Optional end date (DateTime)
- `endTime` - Optional end time (DateTime)
- `location` - Optional location (Text)
- `description` - Optional description (Text)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Authentication

The application uses cookie-based authentication with JWT tokens:
- Tokens are stored in HTTP-only cookies
- Each user can only access their own events
- Protected routes check for valid authentication

## AI Features

### Event Extraction

Users can input natural language text and the AI will extract structured event information:

```
Input: "Meeting with John on Friday at 3pm at Starbucks"
Output: {
  "title": "Meeting with John",
  "startDate": "2026-05-09",
  "startTime": "2026-05-09T15:00:00.000Z",
  "location": "Starbucks"
}
```

The feature uses OpenRouter to access various AI models. Users can:
- Use the server's API key (configured in environment)
- Configure their own personal API key in their profile

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Copyright © 2026 Better Calendar. All rights reserved.

This software and associated documentation files (the "Software") are proprietary and confidential. Unauthorized copying, distribution, modification, or use of this Software, via any medium, is strictly prohibited.

The Software is provided "AS IS", without warranty of any kind, express or implied. The authors or copyright holders shall not be liable for any claim, damages, or other liability arising from the use of the Software.

For licensing inquiries, please contact the project maintainers.

**Status**: Beta version - Subject to change without notice.

## Documentation

For more detailed information, check out the documentation in the `docs/` folder:

- [REST API Reference](docs/REST_API_REFERENCE.md) - Complete API documentation
- [Database Schema](docs/DATABASE.md) - Database details
- [Tech Stack](docs/TECH_STACK.md) - Technology stack information
- [Project Scope](docs/PROJECT_SCOPE.md) - MVP scope and features
- [UI/UX Flow](docs/UI_UX_FLOW.md) - User interface and experience flow
