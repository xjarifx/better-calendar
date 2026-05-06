# API Documentation

Base URL: `http://localhost:3000/api`

All endpoints return JSON responses. Authentication is handled via HTTP-only cookies set during login/register.

## Authentication

The API uses JWT tokens stored in cookies for authentication:
- `token` - JWT token for API authentication
- `userId` - Current user's ID
- `username` - Current user's username

---

## Auth Endpoints

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Responses:**
- `201 Created` - User registered successfully
  ```json
  {
    "id": 1,
    "username": "john_doe",
    "token": "eyJhbGciOi..."
  }
  ```
- `400 Bad Request` - Missing username or password
- `409 Conflict` - Username already exists
- `500 Internal Server Error` - Registration failed

**Side Effects:** Sets `token`, `userId`, and `username` cookies (7-day expiry)

---

### POST /api/auth/login

Login with existing credentials.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Responses:**
- `200 OK` - Login successful
  ```json
  {
    "id": 1,
    "username": "john_doe",
    "token": "eyJhbGciOi..."
  }
  ```
- `400 Bad Request` - Missing username or password
- `401 Unauthorized` - Invalid credentials
- `500 Internal Server Error` - Login failed

**Side Effects:** Sets `token`, `userId`, and `username` cookies (7-day expiry)

---

### POST /api/auth/logout

Logout the current user.

**Responses:**
- `200 OK` - Logout successful
  ```json
  {
    "success": true
  }
  ```

**Side Effects:** Clears `token`, `userId`, and `username` cookies

---

### GET /api/auth/me

Get current authenticated user information.

**Authentication:** Required (cookie-based)

**Responses:**
- `200 OK` - User is authenticated
  ```json
  {
    "authenticated": true,
    "userId": 1,
    "username": "john_doe"
  }
  ```
- `401 Unauthorized` - Not authenticated
  ```json
  {
    "authenticated": false
  }
  ```

---

## User Endpoints

### GET /api/user

Get current user profile information.

**Authentication:** Required (cookie-based)

**Responses:**
- `200 OK` - Profile retrieved successfully
  ```json
  {
    "username": "john_doe",
    "hasApiKey": true
  }
  ```
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - User not found
- `500 Internal Server Error` - Failed to fetch profile

---

### PUT /api/user

Update user profile (currently supports API key update).

**Authentication:** Required (cookie-based)

**Request Body:**
```json
{
  "apiKey": "sk-or-v1-..." | null
}
```

**Responses:**
- `200 OK` - Update successful
  ```json
  {
    "success": true
  }
  ```
- `400 Bad Request` - Invalid API key format (must start with `sk-or-`)
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Failed to update

---

## Event Endpoints

### GET /api/events

List all events for the authenticated user.

**Authentication:** Required (cookie-based)

**Responses:**
- `200 OK` - Events retrieved successfully
  ```json
  [
    {
      "id": 1,
      "userId": 1,
      "title": "Team Meeting",
      "startDate": "2026-05-06T00:00:00.000Z",
      "startTime": "2026-05-06T10:00:00.000Z",
      "endDate": "2026-05-06T00:00:00.000Z",
      "endTime": "2026-05-06T11:00:00.000Z",
      "location": "Conference Room A",
      "description": "Weekly team sync",
      "createdAt": "2026-05-06T08:00:00.000Z",
      "updatedAt": "2026-05-06T08:00:00.000Z"
    }
  ]
  ```
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Failed to fetch events

---

### POST /api/events

Create a new event.

**Authentication:** Required (cookie-based)

**Request Body:**
```json
{
  "title": "string (required)",
  "startDate": "ISO 8601 date string (required)",
  "startTime": "ISO 8601 datetime string (optional)",
  "endDate": "ISO 8601 date string (optional)",
  "endTime": "ISO 8601 datetime string (optional)",
  "location": "string (optional)",
  "description": "string (optional)"
}
```

**Responses:**
- `201 Created` - Event created successfully
  ```json
  {
    "id": 1,
    "userId": 1,
    "title": "Team Meeting",
    "startDate": "2026-05-06T00:00:00.000Z",
    "startTime": "2026-05-06T10:00:00.000Z",
    "endDate": "2026-05-06T00:00:00.000Z",
    "endTime": "2026-05-06T11:00:00.000Z",
    "location": "Conference Room A",
    "description": "Weekly team sync",
    "createdAt": "2026-05-06T08:00:00.000Z",
    "updatedAt": "2026-05-06T08:00:00.000Z"
  }
  ```
- `400 Bad Request` - Missing title or startDate
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Failed to create event

---

### GET /api/events/[id]

Get a single event by ID.

**Authentication:** Required (cookie-based)

**Path Parameters:**
- `id` - Event ID (integer)

**Responses:**
- `200 OK` - Event retrieved successfully
  ```json
  {
    "id": 1,
    "userId": 1,
    "title": "Team Meeting",
    "startDate": "2026-05-06T00:00:00.000Z",
    "startTime": "2026-05-06T10:00:00.000Z",
    "endDate": "2026-05-06T00:00:00.000Z",
    "endTime": "2026-05-06T11:00:00.000Z",
    "location": "Conference Room A",
    "description": "Weekly team sync",
    "createdAt": "2026-05-06T08:00:00.000Z",
    "updatedAt": "2026-05-06T08:00:00.000Z"
  }
  ```
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Event not found or doesn't belong to user
- `500 Internal Server Error` - Failed to fetch event

---

### PUT /api/events/[id]

Update an existing event.

**Authentication:** Required (cookie-based)

**Path Parameters:**
- `id` - Event ID (integer)

**Request Body:**
```json
{
  "title": "string (optional)",
  "startDate": "ISO 8601 date string (optional)",
  "startTime": "ISO 8601 datetime string (optional)",
  "endDate": "ISO 8601 date string (optional)",
  "endTime": "ISO 8601 datetime string (optional)",
  "location": "string (optional)",
  "description": "string (optional)"
}
```

**Responses:**
- `200 OK` - Event updated successfully
  ```json
  {
    "id": 1,
    "userId": 1,
    "title": "Updated Meeting",
    "startDate": "2026-05-06T00:00:00.000Z",
    "startTime": "2026-05-06T10:00:00.000Z",
    "endDate": "2026-05-06T00:00:00.000Z",
    "endTime": "2026-05-06T11:00:00.000Z",
    "location": "Conference Room B",
    "description": "Updated description",
    "createdAt": "2026-05-06T08:00:00.000Z",
    "updatedAt": "2026-05-06T09:00:00.000Z"
  }
  ```
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Event not found or doesn't belong to user
- `500 Internal Server Error` - Failed to update event

---

### DELETE /api/events/[id]

Delete an event.

**Authentication:** Required (cookie-based)

**Path Parameters:**
- `id` - Event ID (integer)

**Responses:**
- `204 No Content` - Event deleted successfully
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Event not found or doesn't belong to user
- `500 Internal Server Error` - Failed to delete event

---

## AI Endpoints

### GET /api/ai/models

Get available free AI models from OpenRouter.

**Authentication:** Not required (uses server's API key)

**Responses:**
- `200 OK` - Models retrieved successfully
  ```json
  {
    "models": [
      {
        "id": "google/gemini-2.0-flash-001",
        "name": "Google Gemini 2.0 Flash",
        "context": "1M",
        "description": "Google's fast and capable multimodal model"
      }
    ]
  }
  ```
- `500 Internal Server Error` - OPENROUTER_API_KEY not configured or failed to fetch

**Note:** Only returns free models (prompt and completion cost = 0)

---

### POST /api/ai/extract

Extract event information from natural language text using AI.

**Authentication:** Required (cookie-based)

**Request Body:**
```json
{
  "text": "string (required) - Natural language text describing events",
  "model": "string (required) - OpenRouter model ID to use"
}
```

**Responses:**
- `200 OK` - Events extracted successfully
  ```json
  {
    "events": [
      {
        "title": "Team Meeting",
        "startDate": "2026-05-06",
        "startTime": "2026-05-06T10:00:00.000Z",
        "endDate": "2026-05-06",
        "endTime": "2026-05-06T11:00:00.000Z",
        "location": "Conference Room A",
        "description": "Weekly team sync"
      }
    ]
  }
  ```
- `400 Bad Request` - Missing text or model
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Failed to extract events (includes error message)

**Note:** Uses user's personal OpenRouter API key if configured, otherwise falls back to server's OPENROUTER_API_KEY environment variable.

---

## Error Response Format

All error responses follow this format:
```json
{
  "error": "Error message describing what went wrong"
}
```

Some endpoints may include additional details:
```json
{
  "error": "Error message",
  "details": "Additional error details (development only)"
}
```

---

## Data Types

### Date Handling
- `startDate` and `endDate`: Date-only values (time portion should be ignored)
- `startTime` and `endTime`: Full datetime values with time information
- All dates are in ISO 8601 format

### Event Types
- **All-day events**: Set `startDate` only, leave `startTime` and `endTime` as `null`
- **Timed events**: Set `startDate`, `startTime`, and optionally `endTime`
- **Multi-day events**: Set `startDate` and `endDate`

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

---

## CORS

CORS is handled by Next.js defaults. For production, configure CORS appropriately if consuming the API from a different domain.
