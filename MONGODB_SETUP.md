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

1. User logs in → Authentication cookie created
2. Settings fetched from MongoDB using userId (from auth cookie)
3. Settings managed via React Context (SettingsProvider)
4. Updates sent to API routes → saved to MongoDB
5. Context refreshes on pathname changes for reactivity

## Database Structure

### Collections

#### `users`

Stores user authentication data:

```typescript
{
  username: string; // Unique username (also used as userId)
  password: string; // Hashed password (bcrypt)
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

#### `usersettings`

Stores user preferences and game state:

```typescript
{
  userId: string; // Username from authentication (unique)
  theme: "light" | "dark"; // Theme preference
  quizMode: boolean; // Quiz mode enabled/disabled
  skipMode: boolean; // Skip mode enabled/disabled
  isLocked: boolean; // Lock state
  timerEndDate: number | null; // 24-hour countdown timer end timestamp
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

### Indexes

- `username`: Unique index on users collection
- `userId`: Unique index on usersettings collection
- `createdAt`: For potential cleanup of old accounts

## API Endpoints

All endpoints use `clue_hunt_auth` cookie for authentication:

### Authentication

- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/me` - Get current user info

### Settings

- `GET /api/settings` - Fetch user settings
- `POST /api/settings/theme` - Toggle theme
- `DELETE /api/settings/theme` - Delete theme setting
- `POST /api/settings/skip-mode` - Toggle skip mode
- `POST /api/settings/quiz-mode` - Toggle quiz mode
- `POST /api/settings/modal` - Toggle settings modal
- `POST /api/settings/lock` - Set lock state
- `POST /api/settings/timer` - Set countdown timer end date
- `DELETE /api/settings/timer` - Clear countdown timer

## Migration History

The application has evolved through several storage architectures:

- **v1**: All settings stored in browser cookies via server actions
- **v2**: Hybrid approach with sessionId in localStorage + MongoDB
- **v3 (Current)**: User authentication with userId-based settings + MongoDB
  - Added user authentication (login/register)
  - Replaced sessionId with userId from auth
  - Added countdown timer feature with MongoDB persistence
  - Settings refresh on pathname changes instead of polling

### Benefits

✅ **User authentication**: Secure login system with hashed passwords  
✅ **Cross-device sync**: Settings tied to user account, not browser  
✅ **Persistent timers**: 24-hour countdown survives page reloads  
✅ **No cookie limitations**: No size restrictions or HTTP header overhead  
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

Type-safe API clients in `src/shared/lib/api/`:

```typescript
import { authApi } from "src/shared/lib/api/auth";
import { settingsApi } from "src/shared/lib/api/settings";

// Authentication
await authApi.login(username, password);
await authApi.register(username, password);
await authApi.logout();
const user = await authApi.getCurrentUser();

// Settings (uses auth cookie automatically)
const settings = await settingsApi.getSettings();
await settingsApi.toggleTheme();
await settingsApi.setTimerEndDate(endTimestamp);
```

### React Context Usage

Components access auth and settings via hooks:

```typescript
import { useAuth } from "@app/context";
import { useSettings } from "@app/context";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { settings, isLoading, refreshSettings } = useSettings();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <p>User: {user?.username}</p>
      <p>Theme: {settings?.theme}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Countdown Timer Feature

The 24-hour countdown timer is stored in MongoDB and persists across sessions:

```typescript
import { useSettings } from "@app/context";

function TimerComponent() {
  const { settings } = useSettings();

  // settings.timerEndDate contains the end timestamp
  // Timer automatically saves to MongoDB when created or expired
  // Timer loads from MongoDB on login/page reload
}
```

## Troubleshooting

### Connection Issues

If you see connection errors:

1. Check your `.env.local` file has the correct `MONGODB_URI`
2. Verify your IP address is whitelisted in MongoDB Atlas
3. Ensure database user credentials are correct
4. Check MongoDB Atlas cluster is running

### Authentication Issues

If login fails or settings don't load:

1. Verify the `clue_hunt_auth` cookie is being set (check browser DevTools)
2. Check API routes are returning proper responses
3. Ensure AuthProvider wraps your app components
4. Verify MongoDB connection is established

### Timer Not Persisting

If countdown timer resets on reload:

1. Check `timerEndDate` field exists in usersettings collection
2. Verify `/api/settings` includes timerEndDate in response
3. Check settings are refreshing after login (pathname change)
4. Ensure timer is saving via `/api/settings/timer` endpoint

### TypeScript Errors

If you encounter type errors:

1. Run `npm run type-check` or `yarn tsc --noEmit` to check for errors
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
