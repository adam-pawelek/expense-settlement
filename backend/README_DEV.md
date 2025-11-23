# Backend Development Setup

This guide explains how to set up the backend for local development with PostgreSQL.

## Option 1: PostgreSQL with Docker (Recommended)

### Start PostgreSQL Container

```bash
# From project root
docker-compose -f docker-compose.dev.yml up -d
```

This will start a PostgreSQL container on port 5432.

### Configure Backend

1. Copy the example environment file:
   ```bash
   cp .env.dev .env
   ```

2. The `.env` file is already configured to connect to the Docker PostgreSQL instance.

3. Start the backend:
   ```bash
   uv run uvicorn src.app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Option 2: SQLite (Default)

If you prefer SQLite for local development:

1. Use the default `.env` or create one with:
   ```bash
   DATABASE_URL=sqlite:///./expense_settlement.db
   ```

2. Start the backend:
   ```bash
   uv run uvicorn src.app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Database Connection Strings

### PostgreSQL (Docker - Local Development)
```
postgresql://expense_user:expense_password@localhost:5432/expense_settlement
```

### PostgreSQL (Docker Compose - Backend in Container)
```
postgresql://expense_user:expense_password@postgres:5432/expense_settlement
```

### SQLite (Local File)
```
sqlite:///./expense_settlement.db
```

## Environment Variables

The backend uses the following environment variables (set in `.env` file):

- `DATABASE_URL` - Database connection string
- `SECRET_KEY` - JWT secret key (change in production!)
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time (default: 30)
- `API_V1_PREFIX` - API prefix (default: /api/v1)

## Switching Between Databases

To switch between SQLite and PostgreSQL, simply update the `DATABASE_URL` in your `.env` file:

```bash
# For SQLite
DATABASE_URL=sqlite:///./expense_settlement.db

# For PostgreSQL (Docker)
DATABASE_URL=postgresql://expense_user:expense_password@localhost:5432/expense_settlement
```

The application will automatically detect the database type and configure the connection accordingly.

## Troubleshooting

### PostgreSQL Connection Issues

1. **Check if PostgreSQL is running:**
   ```bash
   docker-compose -f docker-compose.dev.yml ps
   ```

2. **Check PostgreSQL logs:**
   ```bash
   docker-compose -f docker-compose.dev.yml logs postgres
   ```

3. **Test connection:**
   ```bash
   docker-compose -f docker-compose.dev.yml exec postgres psql -U expense_user -d expense_settlement -c "SELECT 1;"
   ```

4. **Verify connection string:**
   - Make sure the host is `localhost` (not `postgres`) when running backend locally
   - Check that port 5432 is not already in use
   - Verify credentials match those in `docker-compose.dev.yml`

### Database Initialization

The database tables are automatically created on first startup via SQLAlchemy's `init_db()` function. No manual migrations are needed.

### Reset Database

To reset the database:

```bash
# Stop and remove container with data
docker-compose -f docker-compose.dev.yml down -v

# Start fresh
docker-compose -f docker-compose.dev.yml up -d
```






