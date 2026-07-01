.PHONY: install dev backend frontend seed test clean docker-up docker-down

# Install all dependencies
install:
	cd frontend && npm install
	cd backend && pip install -r requirements.txt

# Start everything locally
dev:
	docker-compose up -d postgres
	cd backend && uvicorn app.main:app --reload --port 8000 &
	cd frontend && npm run dev

# Run backend only
backend:
	cd backend && uvicorn app.main:app --reload --port 8000

# Run frontend only
frontend:
	cd frontend && npm run dev

# Seed database
seed:
	cd backend && python -m app.seed.seed

# Run all tests
test:
	cd backend && pytest -v
	cd frontend && npm test

# Docker compose
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

# Clean build artifacts
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name "node_modules" -exec rm -rf {} +
	find . -type d -name ".next" -exec rm -rf {} +