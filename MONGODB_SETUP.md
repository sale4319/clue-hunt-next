# MongoDB Atlas Setup Guide

This application uses MongoDB Atlas for persistent storage of user settings.

## Prerequisites

- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- Node.js 16.9 or higher

## Setup Instructions

### 1. Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account or log in
3. Create a new cluster (free M0 tier is sufficient for development)

### 2. Configure Database Access

1. In your MongoDB Atlas dashboard, go to **Database Access**
2. Click **Add New Database User**
3. Create a username and password (save these - you'll need them for the connection string)
4. Set permissions to **Read and write to any database**

### 3. Configure Network Access

1. Go to **Network Access** in your MongoDB Atlas dashboard
2. Click **Add IP Address**
3. For development, you can click **Allow Access from Anywhere** (0.0.0.0/0)
   - For production, restrict to specific IP addresses

### 4. Get Connection String

1. Go to your cluster and click **Connect**
2. Choose **Connect your application**
3. Select **Node.js** as the driver
4. Copy the connection string

### 5. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder with your actual connection string:

   ```
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.abcde.mongodb.net/clue-hunt?retryWrites=true&w=majority
   ```

   Replace:

   - `yourusername` with your MongoDB username
   - `yourpassword` with your MongoDB password
   - `cluster0.abcde` with your actual cluster address
   - `clue-hunt` with your preferred database name

### 6. Run the Application

```bash
yarn dev
```

The application will automatically:

- Connect to MongoDB on startup
- Create the database and collections as needed
- Store user settings per session

## Architecture Overview

### Session Management

- **Client-side**: Session IDs are generated and stored in `localStorage`
- **Key**: `clue_hunt_session_id`
- **Persistence**: Session IDs persist across browser sessions
- **Server-side**: No cookies required - session ID sent with API requests

### Data Flow

1. User visits the app → Session ID created in localStorage
2. Settings fetched from MongoDB using session ID
3. Settings managed via React Context (SettingsProvider)
4. Updates sent to API routes → saved to MongoDB
5. Context polls for changes every 1 second for reactivity

## Database Structure

### Collections

#### `usersettings`

Stores user preferences and game state:

```typescript
{
  sessionId: string; // Unique session identifier (from localStorage)
  theme: "light" | "dark"; // Theme preference
  quizMode: boolean; // Quiz mode enabled/disabled
  skipMode: boolean; // Skip mode enabled/disabled
  isLocked: boolean; // Lock state
  settingsOpen: boolean; // Settings modal state
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

### Indexes

- `sessionId`: Unique index for fast lookups
- `createdAt`: For potential cleanup of old sessions

## API Endpoints

All endpoints accept `sessionId` as a query parameter:

- `GET /api/settings?sessionId={id}` - Fetch user settings
- `POST /api/settings/theme?sessionId={id}` - Toggle theme
- `DELETE /api/settings/theme?sessionId={id}` - Delete theme setting
- `POST /api/settings/skip-mode?sessionId={id}` - Toggle skip mode
- `POST /api/settings/quiz-mode?sessionId={id}` - Toggle quiz mode
- `POST /api/settings/modal?sessionId={id}` - Toggle settings modal
- `POST /api/settings/lock?sessionId={id}` - Set lock state

## Migration from Cookies

The application was migrated from cookie-based storage to a hybrid approach:

- **Before**: All settings stored in browser cookies via server actions
- **After**:
  - Session ID stored in localStorage (client-side)
  - Settings stored in MongoDB Atlas (server-side)
  - API route handlers instead of server actions
  - Global React Context for state management

### Benefits

✅ **No cookie limitations**: No size restrictions or HTTP header overhead  
✅ **Persistent storage**: Settings survive browser sessions  
✅ **Centralized state**: React Context provides global access  
✅ **RESTful API**: Clean separation of concerns  
✅ **Type-safe**: Full TypeScript support throughout

## Development Notes

### Connection Pooling

MongoDB connections are cached globally to prevent connection exhaustion:

```typescript
// src/shared/lib/mongodb/connection.ts
let cached = global.mongoose;
```

### Client-side API Library

Type-safe API client in `src/shared/lib/api/settings.ts`:

```typescript
import { settingsApi } from "src/shared/lib/api/settings";

// Fetch settings
const settings = await settingsApi.getSettings(sessionId);

// Toggle theme
await settingsApi.toggleTheme(sessionId);
```

### React Context Usage

Components access settings via the `useSettings()` hook:

```typescript
import { useSettings } from "@app/context";

function MyComponent() {
  const { settings, isLoading, refreshSettings } = useSettings();

  if (!settings) return <div>Loading...</div>;

  return <div>Theme: {settings.theme}</div>;
}
```

## Troubleshooting

### Connection Issues

If you see connection errors:

1. Check your `.env.local` file has the correct `MONGODB_URI`
2. Verify your IP address is whitelisted in MongoDB Atlas
3. Ensure database user credentials are correct
4. Check MongoDB Atlas cluster is running

### Session Issues

If settings aren't persisting:

1. Check browser console for localStorage errors
2. Verify sessionId is being generated (check localStorage in DevTools)
3. Check Network tab for API request/response errors

### TypeScript Errors

If you encounter type errors:

1. Run `yarn tsc --noEmit` to check for errors
2. Ensure `dist` directory is excluded in `tsconfig.json`
3. Clear `.next` and `dist` directories and rebuild

---

For more information about the overall project, see [README.md](./README.md).

### Session Management

- Session IDs are created automatically by the middleware (`middleware.ts`)
- The session cookie is HttpOnly and secure in production
- All user settings are tied to this session ID in MongoDB

## Troubleshooting

### Connection Issues

If you see connection errors:

1. Verify your connection string in `.env.local`
2. Check that your IP address is whitelisted in MongoDB Atlas Network Access
3. Ensure your database user has proper permissions
4. Check that the password in the connection string is URL-encoded (special characters need encoding)

### URL Encoding Passwords

If your password contains special characters, they need to be URL-encoded:

- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- etc.

## Development vs Production

- **Development**: Use `.env.local` (not committed to git)
- **Production**: Set `MONGODB_URI` in your hosting platform's environment variables (e.g., Vercel)

## Security Notes

- Never commit `.env.local` or `.env` files to version control
- Use strong passwords for MongoDB users
- Restrict network access in production
- Enable authentication and use least-privilege access
