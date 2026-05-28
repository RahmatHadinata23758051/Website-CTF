# CTF Challenge Platform

A modern, fast, secure, and modular Capture The Flag (CTF) platform built for high-end digital competitions.

---

## 🚀 Technology Stack

### Frontend
- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS (Cyberpunk Minimalist Dark Theme)
- **Routing:** React Router v6
- **State Management:** Zustand
- **Data Querying:** TanStack Query (React Query)
- **HTTP Client:** Axios

### Backend
- **Language:** Go (Golang)
- **Framework:** Fiber
- **Database:** PostgreSQL
- **Caching & Rate Limiting:** Redis
- **Auth:** JSON Web Tokens (JWT) + Hashed credentials (bcrypt/argon2)

### Infrastructure & Deployment
- **Containerization:** Docker & Docker Compose

---

## 📂 Project Structure

```text
ctf-platform/
├── backend/            # Go REST API Server
├── frontend/           # React Single Page App
├── .env.example        # Reference environment keys
├── .gitignore          # Global git ignore configurations
├── README.md           # This document
└── docker-compose.yml  # Local multi-service orchestration
```

---

## 🛠️ Getting Started (Local Development)

Detailed instructions for running the frontend and backend locally will be updated as the individual modules are scaffolded.

### Prerequisites
- [Go](https://go.dev/) (v1.20+)
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) (with Compose v2+)
- [PostgreSQL](https://www.postgresql.org/) & [Redis](https://redis.io/) (if running natively)

---

## 🔒 Security Practices
- **No Client-Side Flags:** Flags are hashed using SHA-256 with a secure custom salt on the server. The client only sees whether a challenge is solved or unsolved.
- **Credential Storage:** User passwords are encrypted with bcrypt/Argon2.
- **JWT Authentication:** Secure user identity validation passed via HTTP-only context structures.
- **Flag Rate Limiting:** Prevent competitors from brute-forcing flag endpoints via active Redis rate limit rules.
