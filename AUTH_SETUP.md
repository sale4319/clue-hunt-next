# Authentication Setup

This application includes a simple username/password authentication system using MongoDB.

## Features

- **User Registration**: Create new accounts with username and password
- **Login**: Authenticate with existing credentials
- **Session Management**: Cookie-based authentication (HTTP-only cookies)
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Logout**: Clear session and return to login page

## Security Notes

⚠️ **IMPORTANT**: The current implementation stores passwords in plain text for simplicity. This is **NOT recommended for production**.

### For Production Deployment:

1. Install bcrypt:

   ```bash
   yarn add bcrypt
   yarn add -D @types/bcrypt
   ```

2. Update `AuthService.ts` to hash passwords:

   ```typescript
   import bcrypt from "bcrypt";

   // When creating user
   const hashedPassword = await bcrypt.hash(password, 10);
   const user = await User.create({ username, password: hashedPassword });

   // When authenticating
   const isValid = await bcrypt.compare(password, user.password);
   ```

3. Consider adding:
   - Email verification
   - Password reset functionality
   - Rate limiting on login attempts
   - JWT tokens instead of cookie-based auth
   - Two-factor authentication (2FA)
   - Session expiration and refresh tokens

## Usage

### Accessing the Login Page

Navigate to `/login` to see the authentication screen. New users can register, existing users can login.

### Protected Routes

All routes except `/login` require authentication. The `AuthProvider` automatically:

- Checks authentication status on page load
- Redirects to `/login` if not authenticated
- Redirects to home (`/`) if already logged in and visiting `/login`

### Using Authentication in Components

```typescript
import { useAuth } from "@app/context";

function MyComponent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated && (
        <>
          <p>Welcome, {user?.username}!</p>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
}
```

### API Endpoints

- `POST /api/auth/register` - Register new user

  - Body: `{ username: string, password: string }`
  - Returns: `{ success: true, user: { username, createdAt } }`

- `POST /api/auth/login` - Login existing user

  - Body: `{ username: string, password: string }`
  - Returns: `{ success: true, user: { username, createdAt } }`

- `POST /api/auth/logout` - Logout current user

  - Returns: `{ success: true }`

- `GET /api/auth/me` - Get current user info
  - Returns: `{ user: { username, createdAt } }`

## Database Schema

### Users Collection

```typescript
{
  username: string; // Unique, 3-50 characters
  password: string; // Min 6 characters (plain text - should be hashed!)
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

Indexes:

- `username`: Unique index for fast lookups and duplicate prevention

## Testing

Create a test user:

1. Visit `/login`
2. Click "Register" toggle
3. Enter username (3-50 chars) and password (6+ chars)
4. Submit form
5. You'll be automatically logged in and redirected to home

## Architecture

```
src/
├── app/
│   ├── api/auth/
│   │   ├── login/route.ts      # Login endpoint
│   │   ├── register/route.ts   # Registration endpoint
│   │   ├── logout/route.ts     # Logout endpoint
│   │   └── me/route.ts         # Current user endpoint
│   └── login/
│       ├── page.tsx            # Login/Register UI
│       └── login.module.css    # Login page styles
├── shared/
│   ├── context/
│   │   └── AuthContext.tsx     # Auth state management
│   ├── lib/
│   │   ├── api/auth.ts         # Client-side API wrapper
│   │   └── mongodb/
│   │       ├── models/User.ts          # User schema
│   │       └── services/AuthService.ts # Auth business logic
```

## Next Steps

- [ ] Add password hashing with bcrypt
- [ ] Add email field and verification
- [ ] Implement password reset flow
- [ ] Add session expiration
- [ ] Add rate limiting
- [ ] Add password strength requirements
- [ ] Add "Remember me" functionality
- [ ] Add OAuth providers (Google, GitHub, etc.)

---

For more information about the project setup, see [README.md](../README.md).
