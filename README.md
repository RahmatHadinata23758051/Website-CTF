# CTF Platform

```text
   ______ ______ ______   ____   _         ___   _____  ______  ____   ____   ___ ___ 
  / ____//_  __// ____/  / __ \ / |       /   | /_  _/ / ____/ / __ \ / __ \ /   |__ \
 / /      / /  / /_     / /_/ // /       / /| |  / /  / /_    / /_/ // /_/ // /| |__/ /
/ /___   / /  / __/    / ____// /___    / ___ | / /  / __/   / _, _// _, _// ___ / __/
\____/  /_/  /_/      /_/    /_____/   /_/  |_|/_/  /_/     /_/ |_|/_/ |_|/_/  |_/____/
```

The Capture The Flag (CTF) Platform is a high-performance, robust, and containerized engine for hosting cyber security jeopardy-style competitions. Architected using a modular monorepo approach, the codebase leverages a compilation-efficient Go (Fiber) REST API backend coupled with a highly interactive, responsive React application.

---

## Technical Architecture

The platform's stack is designed to minimize server latency, ensure atomic flag submissions, and isolate sensitive flag hashes:

### Backend Engine
- **Runtime:** Go (v1.20+)
- **HTTP Routing:** Fiber (v2) for low memory allocation and rapid middleware chains.
- **ORM:** GORM (v1.25) with PostgreSQL relational aggregation.
- **Caching & Sessions:** Redis (v7) for secure rate-limiting queues and scoreboard storage.
- **Cryptography:** bcrypt password verification and salted SHA-256 flag checks.

### Frontend Application
- **Runtime:** React + TypeScript inside a Vite build system.
- **Styling:** Vanilla Tailwind CSS configured for a clean, premium cyberpunk minimal dark theme.
- **State Management:** Zustand for simple, reactive authentication and session caches.
- **API Client:** Axios featuring JWT automated interceptors.
- **Data Querying:** TanStack Query (React Query) for smart caching and dynamic dashboard refreshes.

---

## Directory Structure

The project conforms to a clean, decoupled monorepo architecture:

```text
ctf-platform/
├── backend/            # Go REST API Server
│   ├── cmd/            # Entry point for the binary compile
│   ├── internal/       # Core packages (handlers, routes, services, repositories)
│   └── seeders/        # Pre-configured competitor profiles and challenge seeds
├── frontend/           # React Single Page App
│   ├── src/            # Core UI layout, state stores, and features
│   └── public/         # Production-ready assets and static attachments
├── docker-compose.yml  # Multi-container local engine orchestrator
└── README.md           # Project configuration manual
```

---

## Development Environment Setup

Follow these steps to configure and boot the development servers locally:

### Prerequisites

Ensure you have the following dependencies installed on your workstation:
- Go (v1.20 or higher)
- Node.js (v18 or higher)
- PostgreSQL (running locally on port 5432)
- Redis Server (running locally on port 6379)

### Environment Variables

Configure a `.env` file in the `backend/` directory using the reference template:

```env
PORT=8080
APP_ENV=development
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123
DB_NAME=ctfdb
DB_SSLMODE=disable
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=""
JWT_SECRET=supersecretjwtkeythatisextremelylong123!
FLAG_SALT=ctfsaltsupersecretkey123!
```

### Running the API Server

```bash
cd backend
go mod tidy
go run ./cmd/server
```

### Running the Frontend UI

```bash
cd frontend
npm install
npm run dev
```

---

## Security Policies

This platform is engineered to defend against common CTF manipulation vectors:

- **Isolated Flag Hashes:** Flag hashes are encrypted using SHA-256 + a persistent server-side salt. Hashes are completely excluded from default SELECT statements and are never transmitted to the client.
- **Atomic Double-Solve Prevention:** Score aggregations and solve achievements are locked under an SQL unique index constraint `solves(user_id, challenge_id)`.
- **Brute-Force Defense:** Flag submissions are filtered through a sliding-window rate limiter backed by the database engine.
- **Sensitive Fields Redaction:** The public scoreboard API strictly removes user accounts' roles, email addresses, password hashes, IP addresses, and user-agent strings.

---

## License

This project is open-source software licensed under the [MIT License](LICENSE).
