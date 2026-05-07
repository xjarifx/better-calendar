# AI Input Persistence Plan

## Goal
Make the AI input page (`/events/input`) fully persistent — text input, extracted events, and extraction state survive hard refreshes, navigation, and any user action until explicitly cleared.

## Persistence Strategy (localStorage)

Three keys:
```
ai-input-text       → string              (textarea content, saved on every keystroke)
ai-input-events     → JSON string[]        (extracted events array, saved after extraction completes)
ai-input-extracting → "true" | "false"     (whether extraction is in progress)
```

## Component Order (already implemented)

1. **Persistent text input** (always visible)
2. **Model selector + Extract + Clear**
3. **Save All Events + Cancel** (only when events exist)
4. **List of extracted event(s)** (only when events exist)

## Lifecycle Rules

| Action | Text | Extracted Events | Extracting State |
|--------|------|-----------------|-----------------|
| Mount | Restore from localStorage | Restore from localStorage | Restore from localStorage |
| Keystroke | Save to localStorage | — | — |
| Extract starts | — | Clear in-memory only | Set `true` |
| Extract succeeds | — | Save to localStorage | Set `false` |
| Extract fails | — | Clear localStorage | Set `false` |
| Cancel clicked | — | Clear localStorage | Set `false` (aborts fetch) |
| Clear clicked | Clear localStorage | Clear localStorage | Set `false` |
| Save All success | Keep in localStorage | Clear localStorage | — |

## Edge Cases

- **User navigates away during extraction**: Fetch continues in background (no abort on unmount). `.then()` writes result to localStorage even if component unmounted. On return, mount `useEffect` reads localStorage and restores events.
- **Hard refresh during extraction**: Fetch is lost. On reload, localStorage shows `extracting: true` and no events. Show the text only (user can re-extract).
- **Race condition (fetch resolves after new extraction starts)**: Store a request counter in localStorage. When fetch resolves, check if the counter matches. If not, discard result.
- **localStorage quota**: Unlikely to be hit with text + events data. No special handling needed.

## Files Changed

| File | What |
|------|------|
| `app/events/input/page.tsx` | Add localStorage read/write effects; simplify abort logic; track extracting state |
