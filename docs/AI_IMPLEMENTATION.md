# AI Implementation Documentation

## Overview

The AI feature is the core functionality of Better Calendar. It uses OpenRouter API to extract structured event data from unstructured text pasted by users.

## OpenRouter Integration

### Approach
- **API Client**: Native `fetch` API (no SDK needed - OpenRouter is OpenAI-compatible)
- **Authentication**: Bearer token via `OPENROUTER_API_KEY` environment variable
- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`

### Free Model Selection

Instead of hardcoding a limited list of free models, the application:
1. Fetches all available models from `https://openrouter.ai/api/v1/models`
2. Filters to only include models with `$0` pricing (prompt and completion cost = 0)
3. Displays them in a dropdown for user selection
4. Models are sorted alphabetically by name

### Model Filtering Logic

```typescript
const freeModels = allModels.filter(model => {
  const pricing = model.pricing
  const promptCost = parseFloat(pricing.prompt) || 0
  const completionCost = parseFloat(pricing.completion) || 0
  return promptCost === 0 && completionCost === 0
})
```

## System Prompt Design

The system prompt (`lib/openrouter.ts`) instructs the AI to:
- Extract events as a JSON array
- Return fields: `title`, `startDate` (ISO 8601 date), `startTime` (ISO 8601 datetime), `endDate`, `endTime`, `location`, `description`
- Handle multiple events in a single text paste
- Use current year (2026) if not specified
- Return ONLY valid JSON, no other text

## API Endpoints

### POST /api/ai/extract
Extracts events from unstructured text.

**Request Body:**
```json
{
  "text": "Meeting on Jan 15 at 2pm...",
  "model": "google/gemini-2.0-flash-exp:free"
}
```

**Response:**
```json
{
  "events": [
    {
      "title": "Meeting",
      "startDate": "2026-01-15",
      "startTime": "2026-01-15T14:00:00.000Z",
      "location": "Conference Room B"
    }
  ]
}
```

### GET /api/ai/models
Returns all free models available on OpenRouter.

**Response:**
```json
{
  "models": [
    {
      "id": "google/gemini-2.0-flash-exp:free",
      "name": "Gemini 2.0 Flash",
      "context": "1M",
      "description": "..."
    }
  ]
}
```

## UI Flow

1. **Event Input Page** (`/events/input`)
   - Large textarea for pasting notices
   - Dropdown to select AI model (populated from `/api/ai/models`)
   - "Extract Events" button
   - "Clear" button to reset

2. **Extracted Events Component** (`ExtractedEvents`)
   - Displays extracted events in editable cards
   - Inline editing for all fields
   - Remove individual events
   - "Save All" button to batch create events
   - Redirects to `/calendar` on success

## Error Handling

| Scenario | Handling |
|----------|-----------|
| No OPENROUTER_API_KEY | Return 500 with configuration error |
| AI API failure | Return 500 with error message |
| No events found | Show message "No events found in the text" |
| Invalid JSON response | Parse error with user-friendly message |
| Missing required fields | Highlight in confirmation step |
| Save failure | Show which event failed, allow retry |

## Files Created/Modified

### New Files
- `lib/openrouter.ts` - AI client and system prompt
- `app/api/ai/extract/route.ts` - Extraction API endpoint
- `app/api/ai/models/route.ts` - Free models listing endpoint
- `app/events/input/page.tsx` - Event input page with model selector
- `components/ExtractedEvents.tsx` - Confirmation/edit component
- `docs/AI_IMPLEMENTATION.md` - This documentation

### Modified Files
- `components/Navbar.tsx` - Added navigation links (Calendar, Events, AI Input, New Event)
- `lib/api.ts` - Added `getFreeModels()` and `extractEvents()` methods

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| HTTP client | Native `fetch` | OpenRouter is REST-based, no SDK needed |
| Model storage | Fetched at runtime | Always up-to-date with OpenRouter's free offerings |
| Model selector | Dropdown in input page | Per-request model selection flexibility |
| Batch save | Sequential `createEvent` calls | Individual error handling, simpler rollback |
| Confirmation UI | Inline below textarea | Better UX for editing multiple events |
| Navigation | Expanded Navbar | Easy access to all app sections |

## Environment Variables

```env
OPENROUTER_API_KEY="sk-or-v1-..."  # Required for AI features
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # Optional, for HTTP-Referer header
```

## Future Enhancements

- Save preferred model selection in user settings
- Add model pricing display (for when users want to use paid models)
- Streaming responses for faster perceived performance
- Event suggestion/auto-categorization
- Integration with calendar providers (Google Calendar, etc.)
