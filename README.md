# MathQuest - Interactive Math Learning App

## Tech Stack

### Backend

- **TypeScript**
- **Fastify**
- **PostgreSQL**
- **Prisma ORM**
- **Swagger**

### Frontend

- **React 18**
- **TypeScript**
- **Vite**
- **TailwindCSS**

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Clone

```bash
git clone https://github.com/hutamy/math-quest
cd math-quest
```

### 2. Backend Setup

```bash
cd backend
```

#### Create .env file

Replace `username` and `password` with your desired credentials. Update the `DATABASE_URL` in your `.env` file to match these values.

```bash
echo "DATABASE_URL=postgresql://username:password@localhost:5432/mathquest?schema=public
NODE_ENV=development
APP_NAME=MathQuest
LOG_LEVEL=info
PORT=3000" > .env
```

#### Install depenndencies

```bash
npm install
```

#### Setup database

Run migrations and seeders before start the application

```bash
make migrate
```

#### Run application

```bash
make run
```

#### Run test cases

```bash
make test
```

### 3. Frontend Setup

```bash
cd frontend
```

#### Create .env file

```bash
echo "VITE_API_BASE_URL=http://localhost:3000" > .env
```

#### Install depenndencies

```bash
npm install
```

#### Run application

```bash
npm run dev
```

## Project Structure

```
math-quest/
├── backend/              # Node.js + Fastify API
│   ├── prisma/          # Database schema & migrations
│   ├── src/
│   │   ├── config/      # Manage env variables and prisma client
│   │   ├── domain/      # Business logic & entities
│   │   ├── infrastructure/ # Database repositories
│   │   ├── interfaces/  # HTTP controllers & routes
│   │   ├── test/    # Application test cases
│   │   ├── usecases/    # Application services
│   │   ├── app.ts       # Fastify app setup
│   │   └── server.ts       # Entry point to run application
│   └── test/           # API tests
├── frontend/            # React + TypeScript SPA
│   ├── src/
│   │   ├── components/  # React UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── services/   # API integration
│   │   ├── types/      # TypeScript definitions
│   │   ├── App.tsx        # Main React application component
│   │   ├── index.css      # Global styles
│   │   └── main.tsx       # React app entry point
│   └── public/         # Static assets
└── README.md
```

## API Documentation

```
http://localhost:3000/docs
```

Total Time Spent:

- Total: 5h 45m
- Backend: 3h
- Frontend: 2h 30m
- Documentation: 15m

What I didn't build:

- CI: Omitted due to the 4–6 hour timebox, prioritized delivering functional backend and frontend over setting up pipelines. In a real-world project, CI would be implemented early to ensure consistent testing and deployment.
- Progress animations and micro-interactions: Skipped to focus on implementing core lesson flow and backend API integration. Visual polish would be a follow-up step once functionality is stable.
- Detailed test coverage for frontend: Allocated testing time to backend unit tests to validate core business logic. Frontend verification was done manually due to time constraints.

Approach to designing engaging post-lesson progress reveals

- Milestone Celebrations — Display animated progress bars, achievement badges, and congratulatory messages when learners hit significant milestones.
- Leaderboards & Progress Highlights — Show rankings among peers and personal improvement trends to tap into healthy competition and motivate consistent learning.

How you'd handle 1000+ students using this simultaneously

- Implement a message queue for real-time progress updates to prevent backend overload.
- Use caching layers (e.g., Redis) to handle high concurrency for frequently accessed data.
- Serve static assets through a CDN to reduce server load and improve response times.

2-3 things that work well for teens

- Gamification elements such as points, levels, and streak tracking to keep learning engaging.
- Bite-sized lessons that fit shorter attention spans and busy schedules.

2-3 specific improvements

- Add social features such as leaderboards, streak sharing, and friend challenges.
- Introduce interactive problem-solving formats like drag-and-drop and timed quizzes.
- Implement personalized learning paths to adjust difficulty based on individual performance.
