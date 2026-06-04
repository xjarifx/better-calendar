# API Reference

Base URL: `http://localhost:3000` (dev) or your deployed URL.

## Authentication

Two ways to authenticate — pick whichever works for your use case:

1. **Bearer token**: Set the `Authorization` header to `Bearer <token>`.
2. **Cookies**: Login and register endpoints automatically set `token`, `userId`, and `username` cookies. The `/api/auth/me` endpoint uses these cookies.

When you change your password, the `tokenVersion` on your account increments, which invalidates all existing JWTs. You'll need to log in again.

---

## Auth Endpoints

### `POST /api/auth/register`

Create a new account. Sets cookies and returns a token.

```
Body:   { "username": "johndoe", "password": "securePassword123" }
201:    { "id": 1, "username": "johndoe", "token": "eyJ..." }
400:    { "error": "Username and password required" }
409:    { "error": "Username already exists" }
```

### `POST /api/auth/login`

Log in with existing credentials. Sets cookies and returns a token.

```
Body:   { "username": "johndoe", "password": "securePassword123" }
200:    { "id": 1, "username": "johndoe", "token": "eyJ..." }
400:    { "error": "Username and password required" }
401:    { "error": "Invalid credentials" }
```

### `POST /api/auth/logout`

Clears all auth cookies.

```
200:    { "success": true }
```

### `GET /api/auth/me`

Returns the current user based on the `token` cookie.

```
200:    { "authenticated": true, "userId": 1, "username": "johndoe" }
401:    { "authenticated": false }
```

### `DELETE /api/auth/delete`

Deletes the authenticated user's account and all their events.

```
200:    { "success": true }
401:    { "error": "Unauthorized" }
```

---

## Events Endpoints

All events endpoints require authentication. Events are always scoped to the authenticated user.

### `GET /api/events`

List all events for the authenticated user, ordered by start date ascending.

```
200:    [ { "id": 1, "user_id": 1, "title": "Team Standup", ... } ]
401:    { "error": "Unauthorized" }
```

### `POST /api/events`

Create a new event.

```
Body: {
  "title": "Team Standup",              // required
  "startDate": "2026-05-11",            // required (YYYY-MM-DD)
  "startTime": "2026-05-11T09:00:00Z",  // optional — omit for all-day
  "endDate": "2026-05-11",              // optional — set for multi-day
  "endTime": "2026-05-11T09:30:00Z",    // optional
  "location": "Room B",                 // optional
  "description": "Daily standup"        // optional
}
201:    { "id": 1, "user_id": 1, ... }
400:    { "error": "Title and start date required" }
```

### `GET /api/events/[id]`

Get a single event by ID.

```
200:    { "id": 1, "user_id": 1, ... }
404:    { "error": "Event not found" }
```

### `PUT /api/events/[id]`

Update an existing event. Only send the fields you want to change.

```
Body:   { "title": "Updated Title", "location": "New Location" }
200:    { "id": 1, ...updated fields... }
404:    { "error": "Event not found" }
```

### `DELETE /api/events/[id]`

Delete an event.

```
204:    (no content)
404:    { "error": "Event not found" }
```

---

## User Endpoints

### `GET /api/user`

Get the authenticated user's profile.

```
200:    { "username": "johndoe", "hasApiKey": true, "timeFormat": "12h", "firstDayOfWeek": 0 }
401:    { "error": "Unauthorized" }
```

### `PUT /api/user`

Update user profile. All fields are optional in the body. You can change multiple things at once.

| Field | Description |
|-------|-------------|
| `apiKey` | Your OpenRouter key. Must start with `sk-or-`. Pass `null` to clear. |
| `timeFormat` | `"12h"` or `"24h"` |
| `firstDayOfWeek` | 0 (Sunday) to 6 (Saturday) |
| `username` | New username (requires `currentPassword`) |
| `currentPassword` + `newPassword` | Change password. Returns a new token. |

```
200:    { "success": true }
200:    { "success": true, "token": "eyJ..." }  // when changing password
400:    { "error": "message" }                    // validation errors
```

---

## AI Endpoints

### `GET /api/ai/models`

Lists free OpenRouter models (those with prompt and completion pricing both at 0). Uses the server's `OPENROUTER_API_KEY` env variable. No auth required.

```
200:    { "models": [ { "id": "model-id", "name": "Model Name", "context": "128k", "description": "..." } ] }
500:    { "error": "OPENROUTER_API_KEY is not configured" }
```

### `POST /api/ai/extract`

Extract structured event data from natural language text. Uses your personal API key if you've set one in Settings, otherwise falls back to the server's key.

```
Body: {
  "text": "Meeting with John on Friday at 3pm at Starbucks",
  "model": "openai/gpt-4o"                           // from GET /api/ai/models
}
200:    { "events": [ { "title": "Meeting with John", "startDate": "2026-05-09", "startTime": "...", "location": "Starbucks" } ] }
400:    { "error": "Text is required" } or { "error": "Model is required" }
401:    { "error": "Unauthorized" }
```
