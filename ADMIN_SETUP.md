# Admin Account Setup

## Overview

The admin account feature allows admin users to reset game progress via a "Restart Game" button in the settings menu.

## Database Schema Changes

### Users Collection

Added `isAdmin` field to the User model:

```typescript
{
  username: string;
  password: string;
  isAdmin: boolean; // NEW - defaults to false
  createdAt: Date;
  updatedAt: Date;
}
```

### UserSettings Collection

Added `isAdmin` field to track admin status in user settings:

```typescript
{
  userId: string;
  theme: "light" | "dark";
  quizMode: boolean;
  skipMode: boolean;
  settingsOpen: boolean;
  timerEndDate: number | null;
  isAdmin: boolean; // NEW - defaults to false
  createdAt: Date;
  updatedAt: Date;
}
```

## Creating an Admin Account

### Method 1: MongoDB Atlas Console

1. Connect to your MongoDB Atlas cluster
2. Navigate to the `users` collection
3. Create a new document:

```json
{
  "username": "admin",
  "password": "your-secure-password",
  "isAdmin": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

4. Also create/update the corresponding `usersettings` document:

```json
{
  "userId": "admin",
  "theme": "dark",
  "quizMode": true,
  "skipMode": true,
  "settingsOpen": false,
  "timerEndDate": null,
  "isAdmin": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

### Method 2: Register and Promote

1. Register a normal account in the app
2. In MongoDB, find the created user
3. Update the document to set `isAdmin: true`:

```javascript
db.users.updateOne({ username: "admin" }, { $set: { isAdmin: true } });
```

4. Update the corresponding settings:

```javascript
db.usersettings.updateOne({ userId: "admin" }, { $set: { isAdmin: true } });
```

## Features

### Admin-Only Restart Button

- Admin users see a "Restart Game" button in the settings menu
- Clicking the button prompts a confirmation dialog
- Confirmation resets all game progress:
  - All level completion status reset
  - All quiz completion status reset
  - All statistics reset (skip count, incorrect answers, etc.)
  - Returns user to `/level/start`

### API Endpoint

**POST /api/settings**

```json
{
  "action": "restart"
}
```

Response:

```json
{
  "success": true,
  "message": "Game statistics reset successfully"
}
```

Only admin users can access this endpoint. Non-admin requests will receive a 403 Forbidden response.

## Implementation Details

### RestartButton Component

Located in: `/src/shared/features/settings-menu/src/RestartButton/RestartButton.tsx`

Features:

- Checks `user.isAdmin` before rendering
- Displays confirmation dialog before restart
- Calls `/api/settings` with `action: "restart"`
- Refreshes statistics after successful restart
- Redirects to `/level/start`
- Handles and displays error messages

### Integration

The RestartButton is integrated into the SettingsModal component, appearing after the toggle switches when the user is an admin.

## Testing

1. Create an admin account using one of the methods above
2. Log in with the admin account
3. Open settings menu (click settings icon)
4. Verify "Restart Game" button is visible
5. Click to see confirmation dialog
6. Confirm restart and verify:
   - Page redirects to `/level/start`
   - All levels are locked (except start)
   - All statistics are reset

## Security Notes

- Restart functionality is only available to admin users
- Server-side validation checks admin status on the `/api/settings` endpoint
- Even if a non-admin user somehow sends a restart request, the server will reject it with 403 Forbidden
- Restart is tracked in audit via the API - all progress is reset atomically

## Future Enhancements

Possible improvements:

- Audit logging of restart events (who, when)
- Option to reset only specific user's data (other than self)
- Backup/export game data before restart
- Partial reset options (reset levels only, reset statistics only, etc.)
- Admin dashboard for managing multiple users
