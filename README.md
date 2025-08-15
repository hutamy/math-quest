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

<!-- Todo -->

Total time spend:

- Total time: 5h 45mins
- Backend: 3h
- Frontned: 2h 30mins
- Documentation: 15mins

What I didn't build:

- CI: Omitted due to the 4–6 hour timebox, prioritized delivering functional backend and frontend over setting up pipelines
- Progress animations and micro-interactions: Skipped to focus on implementing core lesson flow and backend API integration.
- Detailed test coverage for frontend: Chose to invest testing time in backend unit tests to validate core business logic.

Approach to designing engaging post-lesson progress reveals

- Milestone celebration
- Leaderboards and highlight progress

How you'd handle 1000+ students using this simultaneously

- To prevent overlod on backend we can implement queue for real time progress update and implementing cache to handle high conncurrency. While on frontend we can implement cdn for static data.

2-3 things that work well for teens

- Gamification (points, levels, streak)
- Bite sixe lesson for shot attention span

2-3 specific improvements

- Social features like leaderboard, share streak, or challange a friend
- Interactive problem solving (drag-and-drop, quick quizzes)
