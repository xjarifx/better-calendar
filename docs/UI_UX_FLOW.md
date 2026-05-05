# UI/UX Flow

## Authentication Flow
1. User visits app → redirected to login if not authenticated
2. Login page: Username + password
3. Signup page: Create account with username and password
4. After login: Redirected to Calendar View
5. Logout: Available in navigation header

## Main Views

### 1. Calendar View
- Monthly/weekly calendar grid displaying saved events
- Events shown as colored blocks with title and time
- Click event to view details
- Navigation: previous/next month, today button

### 2. Event Input View
- Large text area for pasting event notices
- "Extract Events" button
- Support for pasting multiple notices at once
- Clear button to reset text area

## User Flow

### Adding Events via AI
1. User navigates to Event Input view
2. User pastes event notice(s) into text area
3. User clicks "Extract Events" button
4. System sends text to OpenRouter API with system prompt
5. AI returns structured JSON with extracted events
6. **Confirmation/Edit step** - User sees extracted events in a modal/list
7. User can:
   - Edit any field (title, date, time, location, description)
   - Delete an incorrectly extracted event
   - Confirm all events
8. Confirmed events save to PostgreSQL
9. User redirected to Calendar View to see new events

### Error Handling
- If AI cannot extract events: Show error message "Could not extract events. Please check the text format or add manually."
- If API fails: Show "AI service unavailable. Please try again later."
- If required fields missing: Highlight missing fields in confirmation step

## Key Components

### Confirmation/Edit Modal
- Lists all extracted events
- Each event shown as collapsible card
- Inline editing for all fields
- Delete button per event
- "Save All" and "Cancel" buttons

### Calendar Grid
- Standard monthly view
- Events color-coded by type/category (future enhancement)
- Click to expand event details
- Hover for quick preview

## Responsive Design
- Mobile: Stack layout, simplified calendar view
- Desktop: Side-by-side calendar and input panels (optional)
