# Development Setup Guide

This guide explains how to set up the Expense Settlement application for local development.

## Quick Start

### 1. Start PostgreSQL (Docker)

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This starts only the PostgreSQL database container.

### 2. Backend Setup

```bash
cd backend

# Install dependencies
uv sync

# Copy environment file for PostgreSQL
cp .env.dev .env

# Start backend server
uv run uvicorn src.app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will connect to the PostgreSQL database running in Docker.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Workflow

### Backend Development

- Backend runs locally (not in Docker) for faster development
- Connects to PostgreSQL in Docker container
- Hot reload enabled with `--reload` flag
- API available at http://localhost:8000
- API docs at http://localhost:8000/docs

### Frontend Development

- Frontend runs locally (not in Docker) for faster development
- Connects to backend at http://localhost:8000
- Hot reload enabled
- Available at http://localhost:3000

### Database Management

- PostgreSQL runs in Docker container
- Port: `5432`
- Database: `expense_settlement`
- User: `expense_user`
- Password: `expense_password`

#### Access Database with Adminer

1. **Start PostgreSQL with Adminer:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Open Adminer:**
   - URL: http://localhost:8080
   - **System**: PostgreSQL
   - **Server**: `postgres` (when connecting from Adminer container) or `localhost` (if connecting from host)
   - **Username**: `expense_user`
   - **Password**: `expense_password`
   - **Database**: `expense_settlement`

3. **Click "Login"** to access the database

## Environment Files

### Backend

- `.env.dev` - PostgreSQL configuration for local development
- `.env.example` - Example environment file with all options
- `.env` - Your actual environment file (create from `.env.dev`)

### Frontend

- `.env.local` - Local development environment variables
- `NEXT_PUBLIC_API_URL=http://localhost:8000`

## Switching Database Types

### Use PostgreSQL (Docker)

```bash
# Start PostgreSQL
docker-compose -f docker-compose.dev.yml up -d

# Backend .env
DATABASE_URL=postgresql://expense_user:expense_password@localhost:5432/expense_settlement
```

### Use SQLite

```bash
# Backend .env
DATABASE_URL=sqlite:///./expense_settlement.db
```

## Useful Commands

### PostgreSQL

```bash
# Start database
docker-compose -f docker-compose.dev.yml up -d

# Stop database
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f postgres

# Access database shell
docker-compose -f docker-compose.dev.yml exec postgres psql -U expense_user -d expense_settlement

# Reset database (removes all data)
docker-compose -f docker-compose.dev.yml down -v
```

### Backend

```bash
# Run with hot reload
uv run uvicorn src.app.main:app --reload

# Run tests
uv run pytest

# Run specific test file
uv run pytest tests/test_auth.py
```

### Frontend

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Full Docker Setup

If you prefer to run everything in Docker:

```bash
# Start all services (backend, frontend, postgres)
docker-compose up -d
```

See `DOCKER.md` for more details.

## Troubleshooting

### Port Already in Use

If port 5432 is already in use:

1. Change the port in `docker-compose.dev.yml`:
   ```yaml
   ports:
     - "5433:5432"  # Use 5433 on host
   ```

2. Update backend `.env`:
   ```
   DATABASE_URL=postgresql://expense_user:expense_password@localhost:5433/expense_settlement
   ```

### Database Connection Errors

1. Verify PostgreSQL is running:
   ```bash
   docker-compose -f docker-compose.dev.yml ps
   ```

2. Check connection string in `.env` file

3. Verify credentials match `docker-compose.dev.yml`

4. Check if port is accessible:
   ```bash
   nc -zv localhost 5432
   ```

### Backend Not Starting

1. Check if database is ready:
   ```bash
   docker-compose -f docker-compose.dev.yml exec postgres pg_isready -U expense_user
   ```

2. Verify `.env` file exists and has correct `DATABASE_URL`

3. Check backend logs for errors

