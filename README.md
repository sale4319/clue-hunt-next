# Fun project to try out!

## The idea

This is an interactive web application which is designed to limit users to doing things in certain way while preventing them to skip any steps. You should be aware that confusing user experience is **intended** and not a design flaw. Frustration is part of the game just as much as it is part of programming.

## Gameplay

Since the game is meant for people who are learning computer science it is highly encouraged to use any developer tools and techniques to find the hidden elements of the game. Use inspect element and all browser functionality it has to offer, and practice persistence at solving the task at hand. Further development of the game will focus more on actual debugging skills and computer science knowledge.

## Tech Stack

- **Next.js 15** with App Router and React 19
- **MongoDB Atlas** for persistent user settings storage
- **TypeScript** for type safety
- **localStorage** for client-side session management
- **RESTful API routes** for backend operations

## Architecture

The application uses a modern client-server architecture:

- **Client State**: Managed via React Context API with global settings provider
- **Session Management**: Client-side session IDs stored in localStorage
- **Data Persistence**: MongoDB Atlas with Mongoose ODM
- **API Layer**: RESTful endpoints (`/api/settings/*`) for all database operations
- **Real-time Updates**: 1-second polling for settings synchronization

## Running the project locally

### Prerequisites

- Node.js 16.9+ (includes Corepack)
- MongoDB Atlas account (free tier available)
- Yarn package manager

### Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd clue-hunt-next
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Configure MongoDB (see [MONGODB_SETUP.md](./MONGODB_SETUP.md)):

   - Create a MongoDB Atlas account
   - Set up a cluster and database user
   - Copy your connection string

4. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your MongoDB connection string:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clue-hunt
   ```

5. Run the development server:

   ```bash
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── api/settings/            # API route handlers
│   ├── level/                   # Level game pages
│   └── quiz/                    # Quiz game pages
├── shared/
│   ├── components/              # Reusable React components
│   ├── context/                 # React Context providers
│   ├── features/                # Feature modules (settings menu, timer)
│   ├── contracts/               # Type definitions and contracts
│   ├── lib/
│   │   ├── api/                # Client-side API library
│   │   ├── mongodb/            # Database connection and models
│   │   └── clientSession.ts   # Session management
│   └── utils/                   # Utility functions
```

## Key Features

- **Persistent Settings**: User preferences saved in MongoDB
- **Session-based**: Each user gets a unique session ID
- **Dark/Light Theme**: Toggle between themes with instant updates
- **Settings Modal**: Configure quiz mode, skip mode, and locks
- **Responsive Design**: Works on desktop and mobile devices

---
