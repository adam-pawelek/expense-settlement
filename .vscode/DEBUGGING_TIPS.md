# Debugging Tips

## Common Issue: Database Connection Refused

### Problem
When starting the backend debugger, you get:
```
psycopg2.OperationalError: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
```

### Solution

**PostgreSQL is not running!** You need to start it first.

#### Option 1: Use Pre-Launch Task (Recommended)

The debug configurations now automatically start PostgreSQL before launching the backend. Just press `F5` and it will:
1. Start PostgreSQL Docker container
2. Wait for it to be ready
3. Start the backend

#### Option 2: Manual Start

**Start PostgreSQL manually:**

```bash
# From project root
docker compose -f docker-compose.dev.yml up -d

# Or if you have docker-compose (v1)
docker-compose -f docker-compose.dev.yml up -d
```

**Verify it's running:**
```bash
docker compose -f docker-compose.dev.yml ps
```

**Check if database is ready:**
```bash
docker compose -f docker-compose.dev.yml exec postgres pg_isready -U expense_user
```

#### Option 3: Use SQLite Instead

If you don't want to use PostgreSQL, you can switch to SQLite:

1. Edit `backend/.env`:
   ```
   DATABASE_URL=sqlite:///./expense_settlement.db
   ```

2. Restart the debugger

### Quick Check Commands

```bash
# Check if PostgreSQL container is running
docker compose -f docker-compose.dev.yml ps

# View PostgreSQL logs
docker compose -f docker-compose.dev.yml logs postgres

# Start PostgreSQL
docker compose -f docker-compose.dev.yml up -d

# Stop PostgreSQL
docker compose -f docker-compose.dev.yml down
```

### VS Code Task

You can also use the VS Code task:
- Press `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
- Type: "Tasks: Run Task"
- Select: "Start PostgreSQL (Docker)"

This will start PostgreSQL in the background.






