# Makefile for Job Hunt Tracker

.PHONY: up down logs build backend-only frontend backend db dev

# Full stack with Docker (old way)
up:
	docker compose up --build -d
	@echo "Waiting for services to start..."
	@sleep 5
	docker compose logs -f

down:
	docker compose down

# Development mode - backend in Docker, frontend locally
dev:
	@echo "Starting backend services (database + API)..."
	docker compose up db backend -d
	@echo "Waiting for backend to be ready..."
	@sleep 3
	@echo "Backend services started. Now run 'make frontend' in another terminal."
	docker compose logs -f backend

# Start only backend services (db + api)
backend-only:
	docker compose up db backend -d
	docker compose logs -f

# Run frontend dev server locally
frontend:
	@echo "Starting Vite dev server..."
	cd frontend && npm run dev

logs:
	docker compose logs -f

build:
	docker compose build

backend:
	docker compose logs -f backend

db:
	docker compose logs -f db
