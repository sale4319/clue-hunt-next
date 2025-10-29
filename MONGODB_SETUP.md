# MongoDB Atlas Setup Guide

This application now uses MongoDB Atlas for persistent storage of user settings instead of cookies.

## Prerequisites

- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)

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
npm run dev
```

The application will automatically:

- Connect to MongoDB on startup
- Create the database and collections as needed
- Store user settings per session

## Database Structure

### Collections

#### `usersettings`

Stores user preferences and game state:

```typescript
{
  sessionId: string; // Unique session identifier
  theme: "light" | "dark"; // Theme preference
  quizMode: boolean; // Quiz mode enabled/disabled
  skipMode: boolean; // Skip mode enabled/disabled
  isLocked: boolean; // Lock state
  settingsOpen: boolean; // Settings modal state
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

## Migration from Cookies

The application has been migrated from cookie-based storage to MongoDB persistence:

- **Before**: Settings stored in browser cookies
- **After**: Settings stored in MongoDB Atlas, tied to session ID

Each user gets a unique session ID automatically created by Next.js middleware on their first visit. This session ID is stored in a cookie (`clue_hunt_session_id`) that persists for 1 year and is used to retrieve their settings from the database.

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
