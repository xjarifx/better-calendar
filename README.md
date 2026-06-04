# Better Calendar

**What is this project?**

Better Calendar is an AI-powered calendar app. It lets you manage events with a clean UI and also extract events from natural language — like typing "Lunch with Sarah on Thursday at noon" and having it automatically create the event. Built with Next.js 16, TypeScript, PostgreSQL, and OpenRouter AI.

**How do I use it?**

1. Copy `.env.example` to `.env` and fill in your database URL, JWT secret, and OpenRouter API key.
2. Run `npm install` then `npm run db:migrate` to set up the database.
3. Run `npm run dev` to start the dev server, then register an account at `/register`.
4. Use the calendar view to manage events, or head to the AI input page to create events from natural language.
5. Optional: add your own OpenRouter API key in Settings (or the app uses the server's default key).

**Where do I find more details?**

- [Architecture](docs/architecture.md) — how the app is put together
- [Database](docs/database.md) — schema, models, and queries
- [API Reference](docs/api.md) — all REST endpoints and how to call them
