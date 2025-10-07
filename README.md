# Job Hunt Tracker

A small full-stack application to track job applications. Frontend is Vite + React + TypeScript, backend is Node.js + Express + TypeScript, and PostgreSQL provides persistent storage. The project is containerized with Docker Compose.

## Quick start (development)

Make sure Docker is installed and running, then from the repository root:

```bash
make up
```

This will build and start three services:

- `db` - PostgreSQL (port 5432)
- `backend` - Node/Express API (port 5000)
- `frontend` - Vite dev server (port 5173)

Open the frontend: `http://localhost:5173`

## Backend API

Auth endpoints (temporary in-memory store):

- POST `/auth/signup` { email, password } -> 201 created
- POST `/auth/login` { email, password } -> { token }

Example cURL:

```bash
curl -X POST http://localhost:5000/auth/signup -H "Content-Type: application/json" -d '{"email":"me@example.com","password":"pass"}'
```

## Development notes

- The backend auth implementation currently uses an in-memory array. Next step: migrate users to PostgreSQL and add proper migrations.
- To rebuild containers after code changes that affect the Docker image (e.g., adding dependencies), run:

```bash
make build
make up
```

## Next steps

- Persist users to PostgreSQL and add DB migrations.
- Add frontend login/signup pages and token storage.
- Add tests for backend endpoints.

---

If you want, I can implement the DB integration and scaffold the frontend auth pages next.
