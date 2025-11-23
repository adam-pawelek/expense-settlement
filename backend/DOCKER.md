# Docker Setup Guide

This guide explains how to run the Expense Settlement backend using Docker Compose with PostgreSQL.

## Quick Start

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Stop and remove volumes (clean database)
docker-compose down -v
```

## Services

### PostgreSQL Database (`db`)
- **Image**: `postgres:16-alpine`
- **Port**: `5432` (exposed to host)
- **Database**: `expense_settlement`
- **User**: `expense_user`
- **Password**: `expense_password`
- **Volume**: `postgres_data` (persistent storage)

### Backend API (`backend`)
- **Port**: `8000` (exposed to host)
- **Auto-reload**: Enabled (for development)
- **Database Connection**: Automatically configured to connect to `db` service

## Environment Variables

The following environment variables are set in `docker-compose.yml`:

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key (change in production!)
- `ALGORITHM`: JWT algorithm (HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time (30 minutes)
- `API_V1_PREFIX`: API prefix (/api/v1)

## Database Initialization

The database tables are automatically created when the backend starts for the first time. The backend waits for PostgreSQL to be ready before initializing the database.

## Accessing the Database

### From Host Machine

```bash
# Using psql (if installed)
psql -h localhost -U expense_user -d expense_settlement

# Password: expense_password
```

### From Docker Container

```bash
# Connect to database container
docker exec -it expense_settlement_db psql -U expense_user -d expense_settlement
```

## Troubleshooting

### Database Connection Issues

If you see connection errors, make sure:
1. PostgreSQL container is healthy: `docker-compose ps`
2. Backend is waiting for database: Check logs with `docker-compose logs backend`
3. Database credentials match in `docker-compose.yml`

### Port Conflicts

If port 8000 or 5432 is already in use:
1. Change ports in `docker-compose.yml`
2. Update `DATABASE_URL` if you change PostgreSQL port

### Reset Database

To completely reset the database:

```bash
docker-compose down -v
docker-compose up -d
```

This will remove all data and recreate the database.

## Production Considerations

For production deployment:

1. **Change SECRET_KEY**: Use a strong, random secret key
2. **Update CORS**: Restrict allowed origins in `src/app/main.py`
3. **Use Environment Files**: Move sensitive data to `.env` file (not committed)
4. **Database Backups**: Set up regular backups for PostgreSQL
5. **Resource Limits**: Add resource limits to services in `docker-compose.yml`
6. **SSL/TLS**: Configure SSL for database connections
7. **Remove Auto-reload**: Remove `--reload` flag in production

## Development vs Production

The current `docker-compose.yml` is configured for development:
- Auto-reload enabled
- Source code mounted as volume
- Debug-friendly settings

For production, consider:
- Building optimized images
- Using production-ready database settings
- Implementing proper logging
- Setting up monitoring

