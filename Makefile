# Makefile for Job Hunt Tracker

.PHONY: up down logs build frontend backend db

up:
	docker compose up --build -d
	@echo "Waiting for services to start..."
	@sleep 5
	docker compose logs -f

down:
	docker compose down

logs:
	docker compose logs -f

build:
	docker compose build

frontend:
	docker compose logs -f frontend

backend:
	docker compose logs -f backend

db:
	docker compose logs -f db
