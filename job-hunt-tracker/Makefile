# Makefile for Job Hunt Tracker

.PHONY: up down logs build frontend backend db

up:
	docker-compose up --build -d
	docker-compose logs -f

down:
	docker-compose down

logs:
	docker-compose logs -f

build:
	docker-compose build

frontend:
	docker-compose exec frontend sh

backend:
	docker-compose exec backend sh

db:
	docker-compose exec db psql -U jobtracker -d jobtracker
