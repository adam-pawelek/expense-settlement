# Adminer Database Management

Adminer is a lightweight, web-based database management tool that allows you to view and manage your PostgreSQL database through a web interface.

## Accessing Adminer

### Development (docker-compose.dev.yml)

1. **Start services:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Open Adminer:**
   - URL: http://localhost:8080

3. **Login:**
   - **System**: PostgreSQL
   - **Server**: `postgres` (use service name when connecting from Adminer container)
   - **Username**: `expense_user`
   - **Password**: `expense_password`
   - **Database**: `expense_settlement`

### Production (docker-compose.prod.yml or docker-compose.yml)

1. **Start services:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   # or
   docker-compose up -d
   ```

2. **Open Adminer:**
   - URL: http://localhost:8080 (or custom port if `ADMINER_PORT` is set)

3. **Login with same credentials as above**

## Connection Details

### When Adminer is in Docker (Recommended)
- **Server**: `postgres` (use the Docker service name)
- This works because Adminer and PostgreSQL are on the same Docker network

### When Connecting from Host Machine
- **Server**: `localhost` or `127.0.0.1`
- **Port**: `5432` (if connecting directly to PostgreSQL)
- Note: This is only needed if you're running Adminer outside Docker

## Features

With Adminer you can:

- **Browse Tables**: View all tables in the database
- **View Data**: See data in any table
- **Run SQL Queries**: Execute custom SQL queries
- **Edit Data**: Insert, update, and delete records
- **View Structure**: See table schemas and relationships
- **Export Data**: Export tables to SQL, CSV, etc.
- **Import Data**: Import SQL files

## Common Tasks

### View All Tables
1. Login to Adminer
2. Click on `expense_settlement` database
3. You'll see all tables listed

### Run SQL Query
1. Click "SQL command" in the left sidebar
2. Enter your SQL query
3. Click "Execute"

Example queries:
```sql
-- View all users
SELECT * FROM users;

-- View all groups
SELECT * FROM groups;

-- View all expenses
SELECT * FROM expenses;

-- View group members
SELECT * FROM group_members;
```

### View Table Structure
1. Click on a table name
2. Click "Structure" tab
3. See columns, types, constraints, etc.

### Edit Data
1. Click on a table
2. Click "Select data"
3. Click the pencil icon next to any row to edit
4. Or click "New item" to add a new record

## Security Note

⚠️ **Important**: In production, consider:
- Restricting Adminer access (use firewall rules)
- Changing the default port
- Using authentication/authorization
- Only exposing Adminer on internal networks
- Removing Adminer from production if not needed

## Troubleshooting

### Can't Connect to Database

1. **Check if PostgreSQL is running:**
   ```bash
   docker-compose ps
   ```

2. **Check PostgreSQL logs:**
   ```bash
   docker-compose logs postgres
   ```

3. **Verify network connectivity:**
   - If Adminer is in Docker, use `postgres` as server name
   - If connecting from host, use `localhost`

### Port Already in Use

If port 8080 is already in use:

1. **Change Adminer port in docker-compose.yml:**
   ```yaml
   adminer:
     ports:
       - "8081:8080"  # Use 8081 instead
   ```

2. **Access at:** http://localhost:8081

### Connection Timeout

- Ensure PostgreSQL container is healthy
- Check that both services are on the same network
- Verify credentials are correct

## Alternative: Direct PostgreSQL Connection

You can also connect directly to PostgreSQL using any PostgreSQL client:

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `expense_settlement`
- **User**: `expense_user`
- **Password**: `expense_password`

Popular clients:
- pgAdmin
- DBeaver
- psql (command line)
- TablePlus
- DataGrip






