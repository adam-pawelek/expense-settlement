# Docker Setup Guide

This guide explains how to run the Expense Settlement application using Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Access Adminer (Database UI):**
   - Open http://localhost:8080 in your browser
   - Login with:
     - **System**: PostgreSQL
     - **Server**: `postgres`
     - **Username**: `expense_user`
     - **Password**: `expense_password`
     - **Database**: `expense_settlement`

4. **Stop all services:**
   ```bash
   docker-compose down
   ```

5. **Stop and remove volumes (clean slate):**
   ```bash
   docker-compose down -v
   ```

## Services

The Docker Compose setup includes three services:

### 1. PostgreSQL Database
- **Container**: `expense_settlement_postgres`
- **Port**: `5432`
- **Database**: `expense_settlement`
- **User**: `expense_user`
- **Password**: `expense_password`
- **Volume**: `postgres_data` (persistent storage)

### 2. Backend API
- **Container**: `expense_settlement_backend`
- **Port**: `8000`
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Environment**: Development mode with hot reload

### 3. Frontend
- **Container**: `expense_settlement_frontend`
- **Port**: `3000`
- **URL**: http://localhost:3000
- **Environment**: Development mode with hot reload

### 4. Adminer (Database Management)
- **Container**: `expense_settlement_adminer` / `expense_settlement_adminer_dev`
- **Port**: `8080`
- **URL**: http://localhost:8080
- **Description**: Web-based database management tool
- **Login Credentials**:
  - **System**: PostgreSQL
  - **Server**: `postgres` (or `localhost` if connecting from outside Docker)
  - **Username**: `expense_user`
  - **Password**: `expense_password`
  - **Database**: `expense_settlement`

## Environment Variables

### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key (change in production!)
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time (default: 30)
- `API_V1_PREFIX`: API prefix (default: /api/v1)

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000)

## Customization

### Change Database Credentials

Edit `docker-compose.yml` and update:
```yaml
postgres:
  environment:
    POSTGRES_USER: your_user
    POSTGRES_PASSWORD: your_password
    POSTGRES_DB: your_database
```

Then update the `DATABASE_URL` in the backend service accordingly.

### Change Ports

Edit `docker-compose.yml` and modify the port mappings:
```yaml
services:
  backend:
    ports:
      - "8001:8000"  # Change host port from 8000 to 8001
  frontend:
    ports:
      - "3001:3000"  # Change host port from 3000 to 3001
```

## Development Workflow

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Rebuild Services
```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```

### Execute Commands in Containers
```bash
# Backend shell
docker-compose exec backend sh

# Frontend shell
docker-compose exec frontend sh

# Database shell
docker-compose exec postgres psql -U expense_user -d expense_settlement
```

### Run Database Migrations
```bash
# The database is automatically initialized on first startup
# Tables are created automatically via SQLAlchemy
```

## Production Deployment

For production, you should:

1. **Update environment variables:**
   - Change `SECRET_KEY` to a strong random key
   - Use environment-specific database credentials
   - Set `NODE_ENV=production` for frontend

2. **Build production images:**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

3. **Use production Dockerfiles:**
   - Update frontend Dockerfile to build Next.js
   - Remove hot reload from backend
   - Use production-ready configurations

4. **Add reverse proxy:**
   - Use nginx or Traefik for SSL/TLS
   - Configure proper CORS settings
   - Set up proper domain names

## Troubleshooting

### Database Connection Issues
```bash
# Check if database is healthy
docker-compose ps

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Backend Not Starting
```bash
# Check backend logs
docker-compose logs backend

# Verify database is ready
docker-compose exec postgres pg_isready -U expense_user
```

### Frontend Not Connecting to Backend
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check if backend is running: `curl http://localhost:8000/health`
- Check network connectivity: `docker-compose network ls`

### Port Already in Use
```bash
# Find process using port
lsof -i :8000  # or :3000, :5432

# Kill process or change port in docker-compose.yml
```

## Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (deletes database data!)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## Network

All services are connected via the `expense_network` bridge network, allowing them to communicate using service names:
- Backend can access database at `postgres:5432`
- Frontend can access backend at `backend:8000` (internally)

For external access, use `localhost` with the mapped ports.

